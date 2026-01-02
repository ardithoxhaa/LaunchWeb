import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

export function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  return (
    <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Login</h2>
      {error ? <div className="mt-3 rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          try {
            const user = await login({ email, password });
            nav(user.role === 'ADMIN' ? '/admin' : '/');
          } catch (err) {
            setError(err?.response?.data?.error?.message ?? 'Login failed');
          }
        }}
      >
        <label className="block">
          <div className="text-sm text-white/70">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-white/70">Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400"
        >
          Login
        </button>
      </form>
    </div>
  );
}
