import { useState, type FormEvent } from 'react';
import { KeyRound, UserCog, CheckCircle2 } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { adminApi, errorText, toast, updateUser, useAdminSession, signOut, type AdminUser } from '../lib';
import { ForgotPasswordFlow } from './Auth';
import { Card, CardHeader, PageHeader, Button, Field, Input, PasswordInput, ErrorNote } from '../ui';
import { CapLogo } from '../illustrations';

export function Settings() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Your admin profile and password." art={<CapLogo className="mb-6 mr-8 h-[70%]" />} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Profile />
        <Password />
      </div>
    </>
  );
}

function useForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError('');
    setFields({});
    try {
      await fn();
    } catch (e) {
      setError(errorText(e));
      if (e instanceof ApiError) setFields(e.fields);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, fields, run };
}

function Profile() {
  const session = useAdminSession()!;
  const { busy, error, fields, run } = useForm();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run(async () => {
      const { user } = await adminApi<{ user: AdminUser }>('/api/admin/account.php?action=profile', {
        method: 'POST',
        body: { name: f.get('name'), username: f.get('username'), phone: f.get('phone'), email: f.get('email') },
      });
      updateUser(user);
      toast('Profile saved');
    });
  };
  return (
    <Card>
      <CardHeader title={<span className="inline-flex items-center gap-2"><UserCog className="h-4 w-4 text-[#0284c7]" /> Profile</span>} subtitle="Your username is what you type to sign in." />
      <form onSubmit={submit} className="space-y-4 p-5">
        <Field label="Name" htmlFor="p-name" error={fields.name}><Input id="p-name" name="name" required defaultValue={session.user.name} /></Field>
        <Field label="Username" htmlFor="p-username" error={fields.username}>
          <Input id="p-username" name="username" required autoCapitalize="none" spellCheck={false} defaultValue={session.user.username ?? ''} />
        </Field>
        <Field label="Mobile number" htmlFor="p-phone" error={fields.phone} hint="“Forgot password” OTPs are sent to this number — keep it up to date.">
          <Input id="p-phone" name="phone" required inputMode="numeric" autoComplete="tel" pattern="[0-9 +]{10,14}" defaultValue={session.user.phone ?? ''} placeholder="10-digit mobile" />
        </Field>
        <Field label={<>Email <span className="font-normal text-slate-400">(optional)</span></>} htmlFor="p-email" error={fields.email}>
          <Input id="p-email" name="email" type="email" defaultValue={session.user.email ?? ''} />
        </Field>
        {error && !Object.keys(fields).length && <ErrorNote text={error} />}
        <Button type="submit" busy={busy}>Save profile</Button>
      </form>
    </Card>
  );
}

function Password() {
  const session = useAdminSession()!;
  const [forgot, setForgot] = useState(false);
  const { busy, error, fields, run } = useForm();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm !== '' && confirm !== next;
  const rules = [
    { ok: next.length >= 8, text: 'At least 8 characters' },
    { ok: /[A-Za-z]/.test(next) && /\d/.test(next), text: 'Letters and numbers' },
  ];

  const [ruleError, setRuleError] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const broken = rules.find((r) => !r.ok);
    if (broken) {
      setRuleError(broken.text === 'Letters and numbers'
        ? 'Password must contain both letters and numbers, e.g. Padasala2026.'
        : 'Password must be at least 8 characters.');
      return;
    }
    setRuleError('');
    if (mismatch) return;
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    run(async () => {
      await adminApi('/api/admin/account.php?action=password', {
        method: 'POST',
        body: { current_password: f.get('current'), new_password: next },
      });
      formEl.reset();
      setNext('');
      setConfirm('');
      toast('Password changed. Other devices were signed out.');
    });
  };

  return (
    <Card>
      <CardHeader title={<span className="inline-flex items-center gap-2"><KeyRound className="h-4 w-4 text-[#0284c7]" /> Change password</span>} subtitle="Changing it signs you out on every other device." />
      {forgot ? (
        <div className="p-5">
          <ForgotPasswordFlow
            username={session.user.username ?? ''}
            onCancel={() => setForgot(false)}
            onDone={() => {
              toast('Password changed. Please sign in with your new password.');
              signOut(); // the reset signs this admin out everywhere
            }}
          />
        </div>
      ) : (
      <form onSubmit={submit} className="space-y-4 p-5">
        <Field label="Current password" htmlFor="pw-current" error={fields.current_password}>
          <PasswordInput id="pw-current" name="current" required autoComplete="current-password" />
          <button type="button" onClick={() => setForgot(true)} className="mt-1.5 text-xs font-semibold text-[#1565c0] hover:underline">
            Forgot current password? Reset with mobile OTP
          </button>
        </Field>
        <Field label="New password" htmlFor="pw-new" error={ruleError || fields.new_password}>
          <PasswordInput id="pw-new" required autoComplete="new-password" value={next} onChange={(e) => { setNext(e.target.value); setRuleError(''); }} />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {rules.map((r) => (
              <span key={r.text} className={`inline-flex items-center gap-1 text-xs font-medium ${r.ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                <CheckCircle2 className="h-3.5 w-3.5" /> {r.text}
              </span>
            ))}
          </div>
        </Field>
        <Field label="Confirm new password" htmlFor="pw-confirm" error={mismatch ? 'Passwords do not match.' : undefined}>
          <PasswordInput id="pw-confirm" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        {error && !Object.keys(fields).length && <ErrorNote text={error} />}
        <Button type="submit" busy={busy}>Change password</Button>
      </form>
      )}
    </Card>
  );
}
