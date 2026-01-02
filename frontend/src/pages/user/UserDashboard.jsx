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

  const [websiteQuery, setWebsiteQuery] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState('ALL');
  const [pageSize, setPageSize] = useState(8);
  const [pageWebsites, setPageWebsites] = useState(1);

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

  const filteredWebsites = useMemo(() => {
    const q = websiteQuery.trim().toLowerCase();
    return (websites ?? []).filter((w) => {
      if (websiteStatus !== 'ALL' && String(w.status) !== websiteStatus) return false;
      if (!q) return true;
      return `${w.name ?? ''} ${w.slug ?? ''} ${w.status ?? ''}`.toLowerCase().includes(q);
    });
  }, [websiteQuery, websiteStatus, websites]);

  const totalWebsites = filteredWebsites.length;
  const pageCount = Math.max(1, Math.ceil(totalWebsites / Math.max(1, pageSize)));
  const safePage = Math.min(Math.max(1, pageWebsites), pageCount);
  const start = (safePage - 1) * pageSize;
  const visibleWebsites = filteredWebsites.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
            <p className="mt-1 text-white/70">Manage businesses and websites. Create, preview, and publish in minutes.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-white/60">Businesses</div>
              <div className="mt-1 text-2xl font-semibold">{businesses.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-white/60">Websites</div>
              <div className="mt-1 text-2xl font-semibold">{websites.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-white/60">Templates</div>
              <div className="mt-1 text-2xl font-semibold">{templates.length}</div>
            </div>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-3">
          <div className="text-sm font-semibold">Businesses</div>
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-4">
          <div className="text-sm font-semibold">Create website</div>
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold">Websites</div>
              <div className="mt-1 text-xs text-white/60">Search, filter, and manage your sites.</div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <input
                value={websiteQuery}
                onChange={(e) => {
                  setWebsiteQuery(e.target.value);
                  setPageWebsites(1);
                }}
                placeholder="Search websites…"
                className="min-w-0 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/90 placeholder:text-white/40 sm:w-48"
              />
              <select
                value={websiteStatus}
                onChange={(e) => {
                  setWebsiteStatus(e.target.value);
                  setPageWebsites(1);
                }}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/90 sm:w-28"
              >
                <option value="ALL">All</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="max-h-[60vh] overflow-auto p-3">
              {totalWebsites === 0 ? (
                <div className="p-6 text-sm text-white/60">No websites yet.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {visibleWebsites.map((w) => (
                    <div key={w.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{w.name}</div>
                          <div className="mt-1 truncate text-xs text-white/60">/{w.slug}</div>
                          <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                            {w.status}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link
                            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                            to={`/editor/${w.id}`}
                          >
                            Editor
                          </Link>
                          <Link
                            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                            to={`/builder/${w.id}`}
                          >
                            Builder
                          </Link>
                          <Link
                            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                            to={`/assets/${w.id}`}
                          >
                            Assets
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
                  ))}
                </div>
              )}
            </div>

            {totalWebsites > 0 ? (
              <div className="flex flex-col gap-2 border-t border-white/10 bg-black/30 px-3 py-2 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  Showing {Math.min(start + 1, totalWebsites)}-{Math.min(start + pageSize, totalWebsites)} of {totalWebsites}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-white/50">Rows</div>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageWebsites(1);
                    }}
                    className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/90"
                  >
                    {[6, 8, 12, 20].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setPageWebsites((p) => Math.max(1, p - 1))}
                    className="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <div>
                    Page {safePage} / {pageCount}
                  </div>
                  <button
                    type="button"
                    disabled={safePage >= pageCount}
                    onClick={() => setPageWebsites((p) => Math.min(pageCount, p + 1))}
                    className="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
