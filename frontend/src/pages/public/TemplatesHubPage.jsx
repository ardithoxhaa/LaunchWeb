import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

export function TemplatesHubPage() {
  const nav = useNavigate();
  const { accessToken } = useAuth();

  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [websiteName, setWebsiteName] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    async function loadBusinesses() {
      if (!accessToken) return;
      try {
        setLoadingBusinesses(true);
        setError(null);
        const { data } = await api.get('/businesses');
        if (!canceled) {
          const list = data.businesses ?? [];
          setBusinesses(list);
          if (!selectedBusinessId && list.length) setSelectedBusinessId(String(list[0].id));
        }
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load businesses');
      } finally {
        if (!canceled) setLoadingBusinesses(false);
      }
    }

    loadBusinesses();

    return () => {
      canceled = true;
    };
  }, [accessToken, selectedBusinessId]);

  const hasBusinesses = (businesses?.length ?? 0) > 0;

  const selectedBusiness = useMemo(() => {
    return (businesses ?? []).find((b) => String(b.id) === String(selectedBusinessId)) ?? null;
  }, [businesses, selectedBusinessId]);

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-7">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            Templates
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Choose your starting point</h2>
          <p className="mt-3 max-w-3xl text-white/75">
            Pick a professional template to start fast, or create a blank website and build from scratch in the advanced drag-and-drop builder.
          </p>
        </div>
      </div>

      {error ? <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Choose a template</div>
          <div className="mt-2 text-sm text-white/70">
            Browse 8–10 professional templates with multi-page structure (Home/About/Contact) and rich sections.
          </div>
          <Link
            to="/templates/browse"
            className="mt-5 inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Browse templates
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Start from scratch</div>
          <div className="mt-2 text-sm text-white/70">
            Create a blank website in your account and build it section-by-section in the advanced builder.
          </div>

          {!accessToken ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/70">Log in to create a website.</div>
              <button
                type="button"
                onClick={() => nav('/login')}
                className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
              >
                Go to login
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <label className="block">
                <div className="text-sm text-white/70">Business</div>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  disabled={busy || loadingBusinesses || !hasBusinesses}
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                >
                  {!hasBusinesses ? (
                    <option value="">No businesses</option>
                  ) : (
                    (businesses ?? []).map((b) => (
                      <option key={b.id} value={String(b.id)}>
                        {b.name}
                      </option>
                    ))
                  )}
                </select>
              </label>

              <label className="block">
                <div className="text-sm text-white/70">Website name</div>
                <input
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  disabled={busy}
                  placeholder="e.g. My New Website"
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                />
              </label>

              {!hasBusinesses ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                  You need to create a business first.
                  <div className="mt-3">
                    <Link className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15" to="/dashboard">
                      Go to dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={busy || !websiteName.trim() || !selectedBusinessId}
                  onClick={async () => {
                    try {
                      setBusy(true);
                      setError(null);
                      const { data } = await api.post('/websites/blank', {
                        businessId: Number(selectedBusinessId),
                        name: websiteName.trim(),
                      });
                      const id = data?.website?.id;
                      if (!id) throw new Error('Missing website id');
                      nav(`/builder/${id}`);
                    } catch (err) {
                      setError(err?.response?.data?.error?.message ?? err?.message ?? 'Failed to create blank website');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50"
                >
                  {busy ? 'Creating…' : selectedBusiness ? `Create for ${selectedBusiness.name}` : 'Create blank website'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
