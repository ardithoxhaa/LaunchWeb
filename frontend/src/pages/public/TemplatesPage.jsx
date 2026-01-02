import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

export function TemplatesPage() {
  const nav = useNavigate();
  const { accessToken } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const { data } = await api.get('/templates');
        if (!canceled) setTemplates(data.templates ?? []);
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load templates');
      }
    }

    load();

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Templates</h2>
          <p className="mt-1 text-white/70">Choose a template and customize everything.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {error ? (
          <div className="md:col-span-3 rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
        ) : null}
        {templates.map((t) => (
          <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">{t.category}</div>
            <div className="mt-2 text-lg font-semibold">{t.name}</div>
            <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-white/10 to-transparent" />
            <button
              type="button"
              onClick={() => {
                if (!accessToken) {
                  nav('/login');
                  return;
                }
                nav(`/dashboard?templateId=${t.id}`);
              }}
              className="mt-5 w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400"
            >
              Use template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
