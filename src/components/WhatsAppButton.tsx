/**
 * Floating WhatsApp button on the left, visible on every page (website and Android app).
 *
 * WHATSAPP_NUMBER: put the Padasala WhatsApp number here (10 digits, e.g. '9876543210') to open a chat with it.
 * While it is empty, the button opens WhatsApp to share Padasala with a friend.
 */
export const WHATSAPP_NUMBER = '';

const SITE = 'https://padasala.net';

export function WhatsAppButton() {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, '').slice(-10);
  const href = digits
    ? `https://wa.me/91${digits}?text=${encodeURIComponent('Hi Padasala, I have a question.')}`
    : `https://wa.me/?text=${encodeURIComponent(`Find schools, coaching, events and more on Padasala: ${SITE}`)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={digits ? 'Chat with Padasala on WhatsApp' : 'Share Padasala on WhatsApp'}
      title={digits ? 'Chat on WhatsApp' : 'Share on WhatsApp'}
      className="group fixed left-4 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-6px_rgba(37,211,102,0.6)] ring-4 ring-white/80 transition-transform hover:scale-110 active:scale-95 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] lg:bottom-6 lg:left-6"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.5s]" aria-hidden />
      <svg viewBox="0 0 32 32" className="relative h-8 w-8" aria-hidden>
        <path
          d="M16 3.5C9.1 3.5 3.5 8.9 3.5 15.6c0 2.3.7 4.5 1.9 6.4L4 28.5l6.7-1.8c1.6.9 3.4 1.3 5.3 1.3 6.9 0 12.5-5.4 12.5-12.1S22.9 3.5 16 3.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          fill="currentColor"
          d="M12.1 9.9c-.3-.6-.6-.6-.9-.6h-.8c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.2s1.4 3.7 1.6 4c.2.3 2.7 4.3 6.6 5.8 3.3 1.3 4 1 4.7.9.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.6.1-.3.1-.5 0-.7-.1-.2-.8-2.1-1.2-2.9z"
        />
      </svg>
    </a>
  );
}
