import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../lib/api.js';

export function UserDashboard() {
  const location = useLocation();
  const [businesses, setBusinesses] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [websites, setWebsites] = useState([]);

  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessIndustry, setNewBusinessIndustry] = useState('');

  const [newWebsiteName, setNewWebsiteName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const selectedBusiness = useMemo(() => {
    return businesses.find((b) => Number(b.id) === Number(selectedBusinessId)) ?? null;
  }, [businesses, selectedBusinessId]);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const [b, t] = await Promise.all([api.get('/businesses'), api.get('/templates')]);
        if (canceled) return;

        const nextBusinesses = b.data.businesses ?? [];
        setBusinesses(nextBusinesses);
        const nextTemplates = t.data.templates ?? [];
        setTemplates(nextTemplates);
        if (!selectedBusinessId && nextBusinesses.length) setSelectedBusinessId(nextBusinesses[0].id);

        const params = new URLSearchParams(location.search);
        const tplId = params.get('templateId');
        if (tplId && nextTemplates.some((x) => Number(x.id) === Number(tplId))) {
          setSelectedTemplateId(Number(tplId));
        }
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load dashboard data');
      }
    }

    load();

    return () => {
      canceled = true;
    };
  }, [location.search, selectedBusinessId]);

  useEffect(() => {
    let canceled = false;

    async function loadWebsites() {
      if (!selectedBusinessId) {
        setWebsites([]);
        return;
      }

      try {
        setError(null);
        const { data } = await api.get(`/websites/business/${selectedBusinessId}`);
        if (!canceled) setWebsites(data.websites ?? []);
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load websites');
      }
    }

    loadWebsites();

    return () => {
      canceled = true;
    };
  }, [selectedBusinessId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="mt-1 text-white/70">Create a business, pick a template, and start editing.</p>
      </div>

      {error ? <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Businesses</div>
          <div className="mt-3 space-y-3">
            <select
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
              value={selectedBusinessId ?? ''}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
            >
              <option value="" disabled>
                Select business
              </option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <div className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="text-sm font-medium">New business</div>
              <div className="mt-3 space-y-2">
                <input
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  placeholder="Business name"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                />
                <input
                  value={newBusinessIndustry}
                  onChange={(e) => setNewBusinessIndustry(e.target.value)}
                  placeholder="Industry (optional)"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={busy || !newBusinessName.trim()}
                  onClick={async () => {
                    try {
                      setBusy(true);
                      setError(null);
                      const { data } = await api.post('/businesses', {
                        name: newBusinessName.trim(),
                        industry: newBusinessIndustry.trim() ? newBusinessIndustry.trim() : null,
                      });
                      const next = [data.business, ...businesses];
                      setBusinesses(next);
                      setSelectedBusinessId(data.business.id);
                      setNewBusinessName('');
                      setNewBusinessIndustry('');
                    } catch (err) {
                      setError(err?.response?.data?.error?.message ?? 'Failed to create business');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Create website</div>
          <div className="mt-3 space-y-2">
            <div className="text-sm text-white/70">Business</div>
            <div className="text-sm font-medium">{selectedBusiness?.name ?? 'Select a business'}</div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-white/70">Website name</div>
            <input
              value={newWebsiteName}
              onChange={(e) => setNewWebsiteName(e.target.value)}
              placeholder="e.g. Apex Fitness"
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-white/70">Template</div>
            <select
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
              value={selectedTemplateId ?? ''}
              onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
            >
              <option value="" disabled>
                Select template
              </option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={
              busy ||
              !selectedBusinessId ||
              !newWebsiteName.trim() ||
              !Number.isFinite(selectedTemplateId)
            }
            onClick={async () => {
              try {
                setBusy(true);
                setError(null);
                const { data } = await api.post('/websites', {
                  businessId: Number(selectedBusinessId),
                  templateId: Number(selectedTemplateId),
                  name: newWebsiteName.trim(),
                });
                setWebsites([data.website, ...websites]);
                setNewWebsiteName('');
              } catch (err) {
                setError(err?.response?.data?.error?.message ?? 'Failed to create website');
              } finally {
                setBusy(false);
              }
            }}
            className="mt-5 w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50"
          >
            Create website from template
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Websites</div>
          <div className="mt-4 space-y-3">
            {websites.length === 0 ? (
              <div className="text-sm text-white/60">No websites yet.</div>
            ) : (
              websites.map((w) => (
                <div key={w.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{w.name}</div>
                      <div className="mt-1 text-xs text-white/60">/{w.slug}</div>
                      <div className="mt-2 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                        {w.status}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                        to={`/editor/${w.id}`}
                      >
                        Edit
                      </Link>
                      <Link
                        className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                        to={w.status === 'PUBLISHED' ? `/preview/${w.slug}` : `/draft-preview/${w.id}`}
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                          try {
                            setBusy(true);
                            setError(null);
                            if (w.status === 'PUBLISHED') {
                              const { data } = await api.post(`/websites/${w.id}/unpublish`);
                              setWebsites(websites.map((x) => (x.id === w.id ? { ...x, status: data.website.status } : x)));
                            } else {
                              const { data } = await api.post(`/websites/${w.id}/publish`);
                              setWebsites(websites.map((x) => (x.id === w.id ? { ...x, status: data.website.status } : x)));
                            }
                          } catch (err) {
                            setError(err?.response?.data?.error?.message ?? 'Failed to change publish status');
                          } finally {
                            setBusy(false);
                          }
                        }}
                        className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium hover:bg-indigo-400 disabled:opacity-50"
                      >
                        {w.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
