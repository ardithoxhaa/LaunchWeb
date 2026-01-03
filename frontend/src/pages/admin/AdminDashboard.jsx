import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

function Table({
  columns,
  rows,
  rowKey,
  emptyText = 'No data.',
  page,
  pageSize,
  onPageChange,
  maxHeight,
}) {
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), pageCount);
  const start = (safePage - 1) * safePageSize;
  const visible = rows.slice(start, start + safePageSize);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <div className="overflow-auto" style={maxHeight ? { maxHeight } : undefined}>
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-[#0b0f1a] text-white/70">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
            {visible.length ? (
              visible.map((r, idx) => (
              <tr key={rowKey ? rowKey(r) : idx} className="border-t border-white/10 hover:bg-white/5">
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 text-white/80">
                    {c.render ? c.render(r) : String(r?.[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="border-t border-white/10">
              <td className="px-3 py-8 text-center text-white/60" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {total > safePageSize ? (
        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-3 py-2 text-xs text-white/60">
          <div>
            Showing {start + 1}-{Math.min(start + safePageSize, total)} of {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => onPageChange?.(safePage - 1)}
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
              onClick={() => onPageChange?.(safePage + 1)}
              className="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-sm transition hover:from-white/15 hover:to-white/5">
      <div className="text-xs font-medium uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value ?? '—'}</div>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white'
          : 'rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white'
      }
    >
      {children}
    </button>
  );
}

export function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const [pageSize, setPageSize] = useState(15);
  const [pageUsers, setPageUsers] = useState(1);
  const [pageBusinesses, setPageBusinesses] = useState(1);
  const [pageWebsites, setPageWebsites] = useState(1);
  const [pageTemplates, setPageTemplates] = useState(1);

  const [editModal, setEditModal] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [tplName, setTplName] = useState('');
  const [tplCategory, setTplCategory] = useState('');
  const [tplPreviewUrl, setTplPreviewUrl] = useState('');
  const [tplStructure, setTplStructure] = useState(
    JSON.stringify(
      {
        pages: [
          {
            name: 'Home',
            path: '/',
            meta: { title: 'New Template', description: '' },
            components: [
              {
                type: 'NAVBAR',
                props: { logoText: 'New Template', links: [{ label: 'Home', href: '/' }] },
                styles: {},
              },
              {
                type: 'HERO',
                props: { headline: 'Headline', subheadline: 'Subheadline', primaryCta: { label: 'Get started', href: '/' } },
                styles: {},
              },
              { type: 'FOOTER', props: { text: '© New Template' }, styles: {} },
            ],
          },
        ],
      },
      null,
      2
    )
  );

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const [o, u, b, w, t] = await Promise.all([
          api.get('/admin/overview'),
          api.get('/admin/users'),
          api.get('/admin/businesses'),
          api.get('/admin/websites'),
          api.get('/admin/templates'),
        ]);
        if (canceled) return;

        setStats(o.data.stats);
        setUsers(u.data.users ?? []);
        setBusinesses(b.data.businesses ?? []);
        setWebsites(w.data.websites ?? []);
        setTemplates(t.data.templates ?? []);
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load admin data');
      }
    }

    load();

    return () => {
      canceled = true;
    };
  }, []);

  async function reloadTemplatesAndStats() {
    const [o, t] = await Promise.all([api.get('/admin/overview'), api.get('/admin/templates')]);
    setStats(o.data.stats);
    setTemplates(t.data.templates ?? []);
  }

  async function reloadAll() {
    const [o, u, b, w, t] = await Promise.all([
      api.get('/admin/overview'),
      api.get('/admin/users'),
      api.get('/admin/businesses'),
      api.get('/admin/websites'),
      api.get('/admin/templates'),
    ]);
    setStats(o.data.stats);
    setUsers(u.data.users ?? []);
    setBusinesses(b.data.businesses ?? []);
    setWebsites(w.data.websites ?? []);
    setTemplates(t.data.templates ?? []);
  }

  async function loadTemplateIntoEditor(id) {
    const { data } = await api.get(`/admin/templates/${id}`);
    const t = data.template;
    setSelectedTemplateId(t.id);
    setTplName(t.name ?? '');
    setTplCategory(t.category ?? '');
    setTplPreviewUrl(t.preview_image_url ?? '');
    setTplStructure(JSON.stringify(t.structure_json ?? {}, null, 2));
  }

  const q = query.trim().toLowerCase();
  const filteredUsers = q
    ? users.filter((u) => `${u.email ?? ''} ${u.name ?? ''} ${u.role ?? ''}`.toLowerCase().includes(q))
    : users;
  const filteredBusinesses = q
    ? businesses.filter((b) => `${b.name ?? ''} ${b.industry ?? ''} ${b.owner_email ?? ''}`.toLowerCase().includes(q))
    : businesses;
  const filteredWebsites = q
    ? websites.filter((w) => `${w.name ?? ''} ${w.slug ?? ''} ${w.status ?? ''}`.toLowerCase().includes(q))
    : websites;
  const filteredTemplates = q
    ? templates.filter((t) => `${t.name ?? ''} ${t.category ?? ''}`.toLowerCase().includes(q))
    : templates;

  const tableMaxHeight = '60vh';

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Admin dashboard</h2>
            <p className="mt-1 text-white/70">Manage users, businesses, websites, and templates.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              Overview
            </TabButton>
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
              Users
            </TabButton>
            <TabButton active={activeTab === 'businesses'} onClick={() => setActiveTab('businesses')}>
              Businesses
            </TabButton>
            <TabButton active={activeTab === 'websites'} onClick={() => setActiveTab('websites')}>
              Websites
            </TabButton>
            <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>
              Templates
            </TabButton>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Users" value={stats?.users} />
        <StatCard label="Businesses" value={stats?.businesses} />
        <StatCard label="Websites" value={stats?.websites} />
        <StatCard label="Templates" value={stats?.templates} />
      </div>

      {activeTab !== 'overview' ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPageUsers(1);
              setPageBusinesses(1);
              setPageWebsites(1);
              setPageTemplates(1);
            }}
            placeholder="Search…"
            className="w-full bg-transparent px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none"
          />
          <div className="flex items-center justify-between gap-2 md:justify-end">
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/50">Rows</div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageUsers(1);
                  setPageBusinesses(1);
                  setPageWebsites(1);
                  setPageTemplates(1);
                }}
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/90"
              >
                {[10, 15, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}

      {editModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setEditModal(null)} />
          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-black/90">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/60 px-4 py-3">
              <div>
                <div className="text-xs text-white/60">Edit</div>
                <div className="text-lg font-semibold">{editModal.title}</div>
              </div>
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 p-4">
              {(editModal.fields ?? []).map((f) => (
                <label key={f.key} className="block">
                  <div className="text-xs font-medium text-white/70">{f.label}</div>
                  {f.type === 'select' ? (
                    <select
                      value={editDraft?.[f.key] ?? ''}
                      onChange={(e) => setEditDraft((p) => ({ ...(p ?? {}), [f.key]: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
                    >
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={editDraft?.[f.key] ?? ''}
                      onChange={(e) => setEditDraft((p) => ({ ...(p ?? {}), [f.key]: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                disabled={editSaving}
                onClick={async () => {
                  try {
                    setEditSaving(true);
                    setError(null);
                    await editModal.onSave(editDraft);
                    await reloadAll();
                    setEditModal(null);
                  } catch (err) {
                    setError(err?.response?.data?.error?.message ?? 'Failed to save');
                  } finally {
                    setEditSaving(false);
                  }
                }}
                className={
                  editSaving
                    ? 'w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60'
                    : 'w-full rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400'
                }
              >
                {editSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Recent users</div>
            <Table
              rowKey={(r) => r.id}
              columns={[
                { key: 'email', label: 'Email' },
                { key: 'name', label: 'Name' },
                { key: 'role', label: 'Role' },
              ]}
              rows={users.slice(0, 8)}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Recent websites</div>
            <Table
              rowKey={(r) => r.id}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'slug', label: 'Slug' },
                { key: 'status', label: 'Status' },
              ]}
              rows={websites.slice(0, 8)}
            />
          </div>
        </div>
      ) : null}

      {activeTab === 'users' ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Users</div>
          <Table
            rowKey={(r) => r.id}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'email', label: 'Email' },
              { key: 'name', label: 'Name' },
              {
                key: 'role',
                label: 'Role',
                render: (r) => {
                  const isSelf = Number(r.id) === Number(currentUser?.id);
                  return (
                    <div className="flex items-center gap-2">
                      <select
                        disabled={isSelf}
                        value={r.role ?? 'USER'}
                        onChange={(e) => {
                          const nextRole = e.target.value;
                          setUsers((prev) => prev.map((u) => (u.id === r.id ? { ...u, role: nextRole } : u)));
                        }}
                        className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/90 disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={async () => {
                          try {
                            setError(null);
                            const { data } = await api.put(`/admin/users/${r.id}/role`, { role: r.role });
                            setUsers((prev) => prev.map((u) => (u.id === r.id ? { ...u, role: data.user.role } : u)));
                          } catch (err) {
                            setError(err?.response?.data?.error?.message ?? 'Failed to update role');
                          }
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80 hover:bg-white/15 disabled:opacity-50"
                      >
                        Save
                      </button>
                      {isSelf ? <span className="text-xs text-white/40">(you)</span> : null}
                    </div>
                  );
                },
              },
              { key: 'created_at', label: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : '—') },
              {
                key: 'actions',
                label: 'Actions',
                render: (r) => {
                  const isSelf = Number(r.id) === Number(currentUser?.id);
                  return (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditDraft({ email: r.email ?? '', name: r.name ?? '' });
                          setEditModal({
                            title: `User #${r.id}`,
                            fields: [
                              { key: 'email', label: 'Email' },
                              { key: 'name', label: 'Name' },
                            ],
                            onSave: (draft) => api.put(`/admin/users/${r.id}`, { email: draft.email, name: draft.name }),
                          });
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={async () => {
                          if (!window.confirm('Delete this user?')) return;
                          try {
                            setError(null);
                            await api.del(`/admin/users/${r.id}`);
                            await reloadAll();
                          } catch (err) {
                            setError(err?.response?.data?.error?.message ?? 'Failed to delete user');
                          }
                        }}
                        className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-200 hover:bg-red-500/30 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  );
                },
              },
            ]}
            rows={filteredUsers}
            page={pageUsers}
            pageSize={pageSize}
            onPageChange={setPageUsers}
            maxHeight={tableMaxHeight}
            emptyText="No users found."
          />
        </div>
      ) : null}

      {activeTab === 'businesses' ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Businesses</div>
          <Table
            rowKey={(r) => r.id}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'industry', label: 'Industry' },
              { key: 'owner_email', label: 'Owner' },
              { key: 'created_at', label: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : '—') },
              {
                key: 'actions',
                label: 'Actions',
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditDraft({ name: r.name ?? '', industry: r.industry ?? '' });
                        setEditModal({
                          title: `Business #${r.id}`,
                          fields: [
                            { key: 'name', label: 'Name' },
                            { key: 'industry', label: 'Industry' },
                          ],
                          onSave: (draft) => api.put(`/admin/businesses/${r.id}`, { name: draft.name, industry: draft.industry || null }),
                        });
                      }}
                      className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm('Delete this business? This will delete its websites too.')) return;
                        try {
                          setError(null);
                          await api.del(`/admin/businesses/${r.id}`);
                          await reloadAll();
                        } catch (err) {
                          setError(err?.response?.data?.error?.message ?? 'Failed to delete business');
                        }
                      }}
                      className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-200 hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            rows={filteredBusinesses}
            page={pageBusinesses}
            pageSize={pageSize}
            onPageChange={setPageBusinesses}
            maxHeight={tableMaxHeight}
            emptyText="No businesses found."
          />
        </div>
      ) : null}

      {activeTab === 'websites' ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Websites</div>
          <Table
            rowKey={(r) => r.id}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'slug', label: 'Slug' },
              { key: 'status', label: 'Status' },
              { key: 'business_id', label: 'Business' },
              { key: 'published_at', label: 'Published', render: (r) => (r.published_at ? new Date(r.published_at).toLocaleDateString() : '—') },
              {
                key: 'actions',
                label: 'Actions',
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditDraft({ name: r.name ?? '', slug: r.slug ?? '', status: r.status ?? 'DRAFT' });
                        setEditModal({
                          title: `Website #${r.id}`,
                          fields: [
                            { key: 'name', label: 'Name' },
                            { key: 'slug', label: 'Slug' },
                            { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] },
                          ],
                          onSave: (draft) => api.put(`/admin/websites/${r.id}`, { name: draft.name, slug: draft.slug, status: draft.status }),
                        });
                      }}
                      className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm('Delete this website?')) return;
                        try {
                          setError(null);
                          await api.del(`/admin/websites/${r.id}`);
                          await reloadAll();
                        } catch (err) {
                          setError(err?.response?.data?.error?.message ?? 'Failed to delete website');
                        }
                      }}
                      className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-200 hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            rows={filteredWebsites}
            page={pageWebsites}
            pageSize={pageSize}
            onPageChange={setPageWebsites}
            maxHeight={tableMaxHeight}
            emptyText="No websites found."
          />
        </div>
      ) : null}

      {activeTab === 'templates' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Templates</div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTemplateId(null);
                  setTplName('');
                  setTplCategory('');
                  setTplPreviewUrl('');
                }}
                className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15"
              >
                New
              </button>
            </div>
            <Table
              rowKey={(r) => r.id}
              columns={[
                { key: 'id', label: 'ID' },
                {
                  key: 'name',
                  label: 'Name',
                  render: (r) => (
                    <button
                      type="button"
                      onClick={() => loadTemplateIntoEditor(r.id)}
                      className={
                        selectedTemplateId === r.id
                          ? 'text-left font-medium text-white'
                          : 'text-left text-white/90 hover:text-white'
                      }
                    >
                      {r.name}
                    </button>
                  ),
                },
                { key: 'category', label: 'Category' },
                { key: 'created_at', label: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : '—') },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (r) => (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm('Delete this template? Websites using it will keep their own copied structure.')) return;
                        try {
                          setError(null);
                          await api.del(`/admin/templates/${r.id}`);
                          setSelectedTemplateId((cur) => (cur === r.id ? null : cur));
                          await reloadAll();
                        } catch (err) {
                          setError(err?.response?.data?.error?.message ?? 'Failed to delete template');
                        }
                      }}
                      className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-200 hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  ),
                },
              ]}
              rows={filteredTemplates}
              page={pageTemplates}
              pageSize={pageSize}
              onPageChange={setPageTemplates}
              maxHeight={tableMaxHeight}
              emptyText="No templates found."
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
            <div>
              <div className="text-sm font-semibold">{selectedTemplateId ? `Edit template #${selectedTemplateId}` : 'Create template'}</div>
              <div className="mt-1 text-xs text-white/60">
                {selectedTemplateId
                  ? 'Update the existing template in the catalog.'
                  : 'Creates a new template in the templates catalog.'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/70">Name</label>
              <input
                value={tplName}
                onChange={(e) => setTplName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none"
                placeholder="e.g. Neon Barbershop"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/70">Category</label>
              <input
                value={tplCategory}
                onChange={(e) => setTplCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none"
                placeholder="e.g. Barber / Restaurant / SaaS"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/70">Preview image URL (optional)</label>
              <input
                value={tplPreviewUrl}
                onChange={(e) => setTplPreviewUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none"
                placeholder="https://…"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/70">Structure JSON</label>
              <textarea
                value={tplStructure}
                onChange={(e) => setTplStructure(e.target.value)}
                rows={10}
                className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-white/90 placeholder:text-white/40 focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={creating}
              onClick={async () => {
                try {
                  setCreating(true);
                  setError(null);
                  const structure = JSON.parse(tplStructure);
                  if (selectedTemplateId) {
                    await api.put(`/admin/templates/${selectedTemplateId}`, {
                      name: tplName,
                      category: tplCategory,
                      previewImageUrl: tplPreviewUrl ? tplPreviewUrl : null,
                      structure,
                    });
                    await reloadTemplatesAndStats();
                    await loadTemplateIntoEditor(selectedTemplateId);
                  } else {
                    await api.post('/admin/templates', {
                      name: tplName,
                      category: tplCategory,
                      previewImageUrl: tplPreviewUrl ? tplPreviewUrl : null,
                      structure,
                    });
                    await reloadTemplatesAndStats();
                    setTplName('');
                    setTplCategory('');
                    setTplPreviewUrl('');
                  }
                } catch (err) {
                  setError(err?.response?.data?.error?.message ?? err?.message ?? 'Failed to create template');
                } finally {
                  setCreating(false);
                }
              }}
              className={
                creating
                  ? 'w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60'
                  : 'w-full rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400'
              }
            >
              {creating ? (selectedTemplateId ? 'Saving…' : 'Creating…') : selectedTemplateId ? 'Save changes' : 'Create template'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
