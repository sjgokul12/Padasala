/**
 * Talks to the Padasala PHP backend (D:\Padasala\backend).
 *
 * The backend address comes from VITE_API_URL (see .env.example). When it is not set — currently the live
 * Vercel site and the APK — the app keeps working in demo mode with data saved on the device.
 */

export const API_URL = String(import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
export const backendEnabled = API_URL !== '';

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly fields: Record<string, string> = {}) {
    super(message);
  }
}

export async function api<T>(path: string, options: { method?: 'GET' | 'POST'; body?: unknown; token?: string } = {}): Promise<T> {
  const form = options.body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...(options.body !== undefined && !form ? { 'Content-Type': 'application/json' } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: form ? (options.body as FormData) : options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the Padasala server. Check your internet connection and try again.', 0);
  }

  let json: { ok: boolean; data?: T; error?: string; fields?: Record<string, string> } | null = null;
  try {
    json = await res.json();
  } catch {
    // Non-JSON reply (e.g. server crash page).
  }

  // Every Padasala reply has an "ok" field. Anything else means a different program answered at API_URL.
  if (typeof json?.ok !== 'boolean') {
    throw new ApiError(
      `The Padasala backend is not running at ${API_URL} (another program answered with ${res.status}). Start backend\\start-backend.bat and try again.`,
      res.status,
    );
  }

  if (!res.ok || !json.ok) {
    throw new ApiError(json?.error ?? `Server error (${res.status}). Please try again.`, res.status, json?.fields);
  }
  return json.data as T;
}

/** Upload a document, spreadsheet, PDF, or photo picked on the device to the server and return its online link and metadata. */
export async function uploadFile(
  dataUrlOrFile: string | File,
  token?: string,
  preferredName?: string,
): Promise<{ url: string; name: string; size?: number }> {
  let blob: Blob;
  let filename = preferredName || 'file';

  if (typeof dataUrlOrFile === 'string') {
    const res = await fetch(dataUrlOrFile);
    blob = await res.blob();
    if (!preferredName) {
      const type = blob.type.toLowerCase();
      const ext = type.includes('pdf')
        ? 'pdf'
        : type.includes('sheet') || type.includes('excel') || type.includes('csv')
        ? 'xlsx'
        : type.includes('word') || type.includes('document')
        ? 'docx'
        : type.includes('png')
        ? 'png'
        : type.includes('jpeg') || type.includes('jpg')
        ? 'jpg'
        : 'bin';
      filename = `upload.${ext}`;
    }
  } else {
    blob = dataUrlOrFile;
    filename = dataUrlOrFile.name;
  }

  const body = new FormData();
  body.append('file', blob, filename);
  const result = await api<{ url: string; name?: string; size?: number }>('/api/upload.php', { method: 'POST', body, token });
  return {
    url: result.url,
    name: result.name || filename,
    size: result.size || blob.size,
  };
}

/** Upload a photo picked on the device (a data: URL) to the server and return its online link. */
export async function uploadImage(dataUrl: string, token?: string): Promise<string> {
  const res = await uploadFile(dataUrl, token, 'photo.jpg');
  return res.url;
}
