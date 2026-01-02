import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

export function SettingsPage() {
  const { user, setUser, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user?.email, user?.name]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/60">Account</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Settings</h2>
          <p className="mt-1 text-white/70">Update your profile, password, and session security.</p>
        </div>
      </div>

      {error ? <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
      {status ? <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-200">{status}</div> : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-7">
          <div className="text-sm font-semibold">Profile</div>
          <div className="mt-1 text-xs text-white/60">These details are used across LaunchWeb.</div>

          <div className="mt-4 grid gap-3">
            <label className="block">
              <div className="text-xs font-medium text-white/70">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <div className="text-xs font-medium text-white/70">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
                placeholder="you@company.com"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={busy || !name.trim() || !email.trim()}
            onClick={async () => {
              try {
                setBusy(true);
                setError(null);
                setStatus(null);
                const { data } = await api.put('/auth/profile', { name: name.trim(), email: email.trim() });
                if (data.user) setUser(data.user);
                setStatus('Profile updated');
              } catch (err) {
                setError(err?.response?.data?.error?.message ?? 'Failed to update profile');
              } finally {
                setBusy(false);
                setTimeout(() => setStatus(null), 2000);
              }
            }}
            className={
              busy
                ? 'mt-4 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60'
                : 'mt-4 w-full rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50'
            }
          >
            Save profile
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-5">
          <div className="text-sm font-semibold">Security</div>
          <div className="mt-1 text-xs text-white/60">Keep your account protected.</div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-semibold">Change password</div>
            <div className="mt-3 grid gap-3">
              <label className="block">
                <div className="text-xs font-medium text-white/70">Current password</div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
                />
              </label>
              <label className="block">
                <div className="text-xs font-medium text-white/70">New password</div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
                />
              </label>
            </div>

            <button
              type="button"
              disabled={busy || !currentPassword || !newPassword}
              onClick={async () => {
                try {
                  setBusy(true);
                  setError(null);
                  setStatus(null);
                  await api.put('/auth/password', { currentPassword, newPassword });
                  setCurrentPassword('');
                  setNewPassword('');
                  setStatus('Password changed. Please sign in again.');
                  await logout();
                } catch (err) {
                  setError(err?.response?.data?.error?.message ?? 'Failed to change password');
                } finally {
                  setBusy(false);
                  setTimeout(() => setStatus(null), 2500);
                }
              }}
              className={
                busy
                  ? 'mt-4 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60'
                  : 'mt-4 w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 disabled:opacity-50'
              }
            >
              Update password
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-semibold">Sessions</div>
            <div className="mt-1 text-sm text-white/70">Revoke refresh tokens across all devices.</div>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                if (!window.confirm('Log out of all devices? You will be signed out here too.')) return;
                try {
                  setBusy(true);
                  setError(null);
                  setStatus(null);
                  await api.post('/auth/logout-all');
                  setStatus('Logged out of all sessions.');
                  await logout();
                } catch (err) {
                  setError(err?.response?.data?.error?.message ?? 'Failed to log out all sessions');
                } finally {
                  setBusy(false);
                  setTimeout(() => setStatus(null), 2500);
                }
              }}
              className="mt-4 w-full rounded-xl bg-red-500/20 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/30 disabled:opacity-50"
            >
              Log out of all sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
