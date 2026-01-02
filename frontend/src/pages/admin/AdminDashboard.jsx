import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

function Table({ columns, rows, rowKey, emptyText = 'No data.' }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((r, idx) => (
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
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
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
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full bg-transparent px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQuery('')}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15"
          >
            Clear
          </button>
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
              { key: 'role', label: 'Role' },
              { key: 'created_at', label: 'Created', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : '—') },
            ]}
            rows={filteredUsers}
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
            ]}
            rows={filteredBusinesses}
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
            ]}
            rows={filteredWebsites}
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
              ]}
              rows={filteredTemplates}
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
