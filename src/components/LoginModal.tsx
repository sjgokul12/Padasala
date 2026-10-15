import { useState } from 'react';
import { LogIn, UserPlus, Sparkles, ChevronDown } from 'lucide-react';
import { Modal } from './ui';
import {
  useLoginUi, closeLogin, openLogin, login, loginDemo, register, roles, roleOrder, type Role,
} from '@/lib/auth';
import { navigate } from '@/lib/router';
import { districts } from '@/data/districts';

export function LoginModal() {
  const ui = useLoginUi();
  // Remount the form whenever the dialog is reopened so fields start clean.
  return (
    <Modal open={ui.open} onClose={closeLogin} title={ui.mode === 'login' ? 'Login to Padasala' : 'Create your account'}>
      {ui.open && <LoginForm key={`${ui.role}-${ui.mode}`} initialRole={ui.role} mode={ui.mode} />}
    </Modal>
  );
}

function LoginForm({ initialRole, mode }: { initialRole: Role; mode: 'login' | 'register' }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const info = roles[role];
  const Icon = info.icon;

  const finish = (r: Role) => {
    closeLogin();
    navigate(roles[r].home);
  };

  const categories = mode === 'register' ? roleOrder.filter((r) => r !== 'admin') : roleOrder;

  return (
    <div className="space-y-4">
      {/* Category selector, like net-banking login types */}
      <div>
        <label className="label" htmlFor="login-role">{mode === 'login' ? 'Login as' : 'Register as'}</label>
        <div className="relative">
          <select
            id="login-role"
            value={role}
            onChange={(e) => { setRole(e.target.value as Role); setError(''); }}
            className="input appearance-none pl-12 pr-10 font-semibold"
          >
            {categories.map((r) => <option key={r} value={r}>{roles[r].label}</option>)}
          </select>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-[#0284c7]">
            <Icon className="h-4 w-4" />
          </span>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">{info.desc}</p>
      </div>

      {mode === 'login' ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (login(role, phone)) finish(role);
            else setError(`No ${info.label} account found for this mobile number. Register first, or try the demo account.`);
          }}
        >
          <div>
            <label className="label" htmlFor="login-phone">Mobile number</label>
            <input id="login-phone" required inputMode="numeric" pattern="[0-9 +]{10,14}" className="input" placeholder="10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="login-pass">Password</label>
            <input id="login-pass" type="password" required className="input" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            <LogIn className="h-4 w-4" /> Login as {info.label}
          </button>
        </form>
      ) : (
        <form
          className="grid sm:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            register({
              role,
              name: String(f.get('name')),
              phone: String(f.get('phone')),
              email: String(f.get('email') ?? ''),
              district: String(f.get('district') ?? ''),
            });
            finish(role);
          }}
        >
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reg-name">{role === 'student' ? 'Full name' : role === 'teacher' ? 'Your name' : 'Name of school / centre / company'}</label>
            <input id="reg-name" name="name" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="reg-phone">Mobile number</label>
            <input id="reg-phone" name="phone" required inputMode="numeric" pattern="[0-9 +]{10,14}" className="input" placeholder="10-digit mobile" />
          </div>
          <div>
            <label className="label" htmlFor="reg-district">District</label>
            <select id="reg-district" name="district" required className="input">
              <option value="">Select…</option>
              {districts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reg-email">Email (optional)</label>
            <input id="reg-email" name="email" type="email" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reg-pass">Create password</label>
            <input id="reg-pass" type="password" required minLength={6} className="input" />
          </div>
          <button type="submit" className="btn-primary sm:col-span-2">
            <UserPlus className="h-4 w-4" /> Create {info.label} account
          </button>
        </form>
      )}

      <div className="relative py-1 text-center text-xs font-semibold text-slate-400">
        <span className="relative z-10 bg-white px-3">or</span>
        <span className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
      </div>

      <button type="button" onClick={() => { loginDemo(role); finish(role); }} className="btn-outline w-full text-sm">
        <Sparkles className="h-4 w-4" /> Try the demo {info.label} account
      </button>

      <p className="text-center text-sm text-slate-600">
        {mode === 'login' ? (
          <>New to Padasala?{' '}<button className="font-bold text-[#0284c7]" onClick={() => openLogin(role === 'admin' ? 'student' : role, 'register')}>Register here</button></>
        ) : (
          <>Already registered?{' '}<button className="font-bold text-[#0284c7]" onClick={() => openLogin(role, 'login')}>Login</button></>
        )}
      </p>
    </div>
  );
}
