import { useAuth } from '../../auth/AuthContext.jsx';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="mt-1 text-white/70">Your account details.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="text-white/60">Name</div>
            <div className="font-medium">{user?.name ?? '—'}</div>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="text-white/60">Email</div>
            <div className="font-medium">{user?.email ?? '—'}</div>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="text-white/60">Role</div>
            <div className="font-medium">{user?.role ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
