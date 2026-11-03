import { useEffect, useState } from 'react';
import { ShieldCheck, RotateCw, Smartphone } from 'lucide-react';
import { Modal } from './ui';
import { requestOtp, type OtpPurpose, type Role } from '@/lib/auth';
import { useStored, setStored } from '@/lib/store';

/** Thrown when the user closes the OTP dialog; callers can ignore it (its message is empty). */
export class OtpCancelled extends Error {
  constructor() {
    super('');
  }
}

interface Pending {
  purpose: OtpPurpose;
  role: Role;
  phone: string;
  action: (otp: string) => Promise<unknown>;
  resolve: () => void;
  reject: (e: Error) => void;
}

interface OtpUi {
  open: boolean;
  phone: string;
  devCode?: string;
  resendIn: number;
  sentAt: number;
}

let pending: Pending | null = null;
const closedUi: OtpUi = { open: false, phone: '', resendIn: 0, sentAt: 0 };

/**
 * Send an OTP to `phone`, ask the user to type it, then run `action(otp)` (e.g. register or login).
 * Resolves when the action succeeds; errors from sending the OTP are thrown to the caller;
 * closing the dialog rejects with OtpCancelled.
 */
export async function verifyWithOtp(opts: Omit<Pending, 'resolve' | 'reject'>): Promise<void> {
  const sent = await requestOtp(opts.purpose, opts.role, opts.phone);
  return new Promise<void>((resolve, reject) => {
    pending?.reject(new OtpCancelled());
    pending = { ...opts, resolve, reject };
    setStored<OtpUi>('ui:otp', { open: true, phone: opts.phone, devCode: sent.devCode, resendIn: sent.resendIn, sentAt: Date.now() });
  });
}

const maskPhone = (p: string) => {
  const d = p.replace(/\D/g, '').slice(-10);
  return `+91 ${d.slice(0, 2)}••• ••${d.slice(7)}`;
};

export function OtpDialog() {
  const [ui] = useStored<OtpUi>('ui:otp', closedUi);
  const close = () => {
    setStored('ui:otp', closedUi);
    pending?.reject(new OtpCancelled());
    pending = null;
  };
  return (
    <Modal top open={ui.open} onClose={close} title="Verify your mobile number">
      {ui.open && <OtpForm key={ui.sentAt} ui={ui} />}
    </Modal>
  );
}

function OtpForm({ ui }: { ui: OtpUi }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const wait = Math.max(0, Math.ceil(ui.resendIn - (now - ui.sentAt) / 1000));

  const verify = async () => {
    if (!pending || busy) return;
    if (!/^\d{4,8}$/.test(code)) {
      setError('Enter the 6-digit OTP.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await pending.action(code);
      const done = pending;
      pending = null;
      setStored('ui:otp', closedUi);
      done.resolve();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not verify the OTP. Please try again.');
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!pending || wait > 0) return;
    setError('');
    try {
      const sent = await requestOtp(pending.purpose, pending.role, pending.phone);
      setStored<OtpUi>('ui:otp', { ...ui, devCode: sent.devCode, resendIn: sent.resendIn, sentAt: Date.now() });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send a new OTP.');
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        verify();
      }}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-sky-50 p-3.5 ring-1 ring-sky-100">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0284c7] shadow-sm">
          <Smartphone className="h-5 w-5" />
        </span>
        <p className="text-sm text-slate-700">
          We sent a 6-digit OTP to <b className="whitespace-nowrap text-[#0b1f33]">{maskPhone(ui.phone)}</b>. It is valid for 5 minutes.
        </p>
      </div>

      {ui.devCode && (
        <p className="rounded-2xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
          Test mode — no SMS is sent yet. Your OTP is <b className="font-mono text-base tracking-widest">{ui.devCode}</b>
        </p>
      )}

      <div>
        <label className="label" htmlFor="otp-code">Enter OTP</label>
        <input
          id="otp-code"
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="••••••"
          className="input py-4 text-center font-mono text-2xl font-bold tracking-[0.6em] placeholder:tracking-[0.6em]"
        />
      </div>

      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

      <button type="submit" disabled={busy || code.length < 6} className="btn-primary w-full disabled:opacity-60">
        <ShieldCheck className="h-4 w-4" /> {busy ? 'Verifying…' : 'Verify & continue'}
      </button>

      <p className="text-center text-sm text-slate-600">
        Didn’t get it?{' '}
        {wait > 0 ? (
          <span className="font-semibold text-slate-400">Resend in {wait}s</span>
        ) : (
          <button type="button" onClick={resend} className="inline-flex items-center gap-1 font-bold text-[#0284c7]">
            <RotateCw className="h-3.5 w-3.5" /> Resend OTP
          </button>
        )}
      </p>
    </form>
  );
}
