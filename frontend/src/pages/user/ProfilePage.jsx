import { useAuth } from '../../auth/AuthContext.jsx';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-white/60">Account</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Profile</h2>
            <p className="mt-1 text-white/70">Your account information and quick actions.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-white/60">Signed in as</div>
              <div className="mt-1 text-sm font-semibold">{user?.email ?? '—'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-white/60">Role</div>
              <div className="mt-1 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                {user?.role ?? '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-7">
          <div className="text-sm font-semibold">Account details</div>
          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between gap-6 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
              <div className="text-white/60">Name</div>
              <div className="font-medium">{user?.name ?? '—'}</div>
            </div>
            <div className="flex items-center justify-between gap-6 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
              <div className="text-white/60">Email</div>
              <div className="font-medium">{user?.email ?? '—'}</div>
            </div>
            <div className="flex items-center justify-between gap-6 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
              <div className="text-white/60">User ID</div>
              <div className="font-medium">{user?.id ?? '—'}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-5">
          <div className="text-sm font-semibold">Quick actions</div>
          <div className="mt-4 grid gap-3">
            <a href="/settings" className="rounded-xl border border-white/10 bg-black/20 p-4 hover:bg-black/30">
              <div className="text-sm font-semibold">Settings</div>
              <div className="mt-1 text-sm text-white/70">Update your profile, password, and sessions.</div>
            </a>
            <a href="/templates" className="rounded-xl border border-white/10 bg-black/20 p-4 hover:bg-black/30">
              <div className="text-sm font-semibold">Browse templates</div>
              <div className="mt-1 text-sm text-white/70">Preview and choose a flagship template.</div>
            </a>
            <a href="/dashboard" className="rounded-xl border border-white/10 bg-black/20 p-4 hover:bg-black/30">
              <div className="text-sm font-semibold">Go to dashboard</div>
              <div className="mt-1 text-sm text-white/70">Create a website and start building.</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
