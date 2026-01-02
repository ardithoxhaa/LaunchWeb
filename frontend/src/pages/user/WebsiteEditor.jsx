import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';

const COMPONENT_TYPES = ['NAVBAR', 'HERO', 'FEATURES', 'CONTENT', 'CARDS', 'GALLERY', 'PRICING', 'CONTACT_FORM', 'FOOTER'];

function safeJsonParse(value) {
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function ColorInput({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="text-sm text-white/70">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value ?? '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 rounded-md border border-white/10 bg-black/30"
        />
        <input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 flex-1 rounded-md border border-white/10 bg-black/30 px-3 text-sm"
        />
      </div>
    </label>
  );
}

function JsonEditor({ label, value, onChange }) {
  const [text, setText] = useState(JSON.stringify(value ?? {}, null, 2));
  const [error, setError] = useState(null);

  useEffect(() => {
    setText(JSON.stringify(value ?? {}, null, 2));
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{label}</div>
      {error ? <div className="rounded-md bg-red-500/10 p-2 text-xs text-red-200">{error}</div> : null}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
        onBlur={() => {
          const parsed = safeJsonParse(text);
          if (!parsed.ok) {
            setError('Invalid JSON');
            return;
          }
          onChange(parsed.value);
        }}
        className="h-40 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs"
      />
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="text-sm text-white/70">{label}</div>
      <input
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
      />
    </label>
  );
}

function SmallButton({ children, onClick, variant = 'neutral', disabled }) {
  const cls =
    variant === 'primary'
      ? 'bg-indigo-500 hover:bg-indigo-400'
      : variant === 'danger'
        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200'
        : 'bg-white/10 hover:bg-white/15';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}

function defaultPropsForType(type) {
  switch (type) {
    case 'NAVBAR':
      return { logoText: 'My Business', links: [{ label: 'Home', href: '/' }] };
    case 'HERO':
      return { headline: 'Headline', subheadline: 'Short supporting copy', primaryCta: { label: 'Get started', href: '/contact' } };
    case 'FEATURES':
      return { items: [{ title: 'Feature', text: 'Describe value' }] };
    case 'CONTENT':
      return { title: 'Section title', paragraphs: ['Your paragraph here.'] };
    case 'CARDS':
      return {
        cards: [
          { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
          { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
          { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
        ],
      };
    case 'GALLERY':
      return { images: ['https://example.com/image-1.jpg', 'https://example.com/image-2.jpg', 'https://example.com/image-3.jpg'] };
    case 'PRICING':
      return {
        plans: [
          { name: 'Starter', price: '€19', period: '/mo', features: ['Feature A', 'Feature B', 'Feature C'] },
          { name: 'Pro', price: '€49', period: '/mo', features: ['Feature A', 'Feature B', 'Feature C'] },
          { name: 'Agency', price: '€99', period: '/mo', features: ['Feature A', 'Feature B', 'Feature C'] },
        ],
      };
    case 'CONTACT_FORM':
      return { headline: 'Contact us', fields: ['name', 'email', 'message'] };
    case 'FOOTER':
      return { text: '© My Business' };
    default:
      return {};
  }
}

function defaultStylesForType(type) {
  switch (type) {
    case 'NAVBAR':
      return { variant: 'solid' };
    case 'HERO':
      return { layout: 'split', backgroundColor: null, buttonColor: null };
    case 'FEATURES':
      return { columns: 3 };
    case 'CONTENT':
      return { width: 'md' };
    case 'CONTACT_FORM':
      return { layout: 'card' };
    case 'FOOTER':
      return { variant: 'dark' };
    default:
      return {};
  }
}

export function WebsiteEditor() {
  const { id } = useParams();
  const websiteId = Number(id);

  const [website, setWebsite] = useState(null);
  const [pages, setPages] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const [addType, setAddType] = useState('HERO');
  const [dragIndex, setDragIndex] = useState(null);
  const [dragNewType, setDragNewType] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const { data: payload } = await api.get(`/websites/${websiteId}/structure`);
        if (!canceled) {
          setWebsite(payload.website);
          setPages(payload.pages);
          setActivePageIndex(0);
          setActiveComponentIndex(0);
        }
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load website');
      }
    }

    if (Number.isFinite(websiteId)) load();

    return () => {
      canceled = true;
    };
  }, [websiteId]);

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-2xl font-semibold">Website editor</div>
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      </div>
    );
  }

  if (!website || !pages) {
    return (
      <div className="space-y-3">
        <div className="text-2xl font-semibold">Website editor</div>
        <div className="text-sm text-white/60">Loading…</div>
      </div>
    );
  }

  const activePage = pages?.[activePageIndex] ?? null;
  const activeComponent = activePage?.components?.[activeComponentIndex] ?? null;

  const themePrimary = website?.settings?.theme?.primary ?? '#6366f1';
  const themeBackground = website?.settings?.theme?.background ?? '#070a12';

  const canRender = Array.isArray(pages);

  const componentTypes = COMPONENT_TYPES;

  async function saveStructure(nextPages) {
    setSaving(true);
    setStatus(null);
    try {
      const payloadPages = (nextPages ?? []).map((p, pidx) => ({
        name: p.name,
        path: p.path,
        sortOrder: p.sortOrder ?? p.sort_order ?? pidx,
        meta: p.meta ?? {},
        components: (p.components ?? []).map((c, idx) => ({
          type: c.type,
          orderIndex: idx,
          props: c.props ?? {},
          styles: c.styles ?? {},
        })),
      }));

      const { data: resp } = await api.put(`/websites/${websiteId}/structure`, { pages: payloadPages });
      setWebsite(resp.website);
      setPages(resp.pages);
      setStatus('Saved');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  async function saveSettings(nextSettings) {
    setSaving(true);
    setStatus(null);
    try {
      const { data: resp } = await api.put(`/websites/${websiteId}/settings`, { settings: nextSettings });
      setWebsite(resp.website);
      setStatus('Saved');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to save settings');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  async function saveSeo(nextSeo) {
    setSaving(true);
    setStatus(null);
    try {
      const { data: resp } = await api.put(`/websites/${websiteId}/seo`, { seo: nextSeo });
      setWebsite(resp.website);
      setStatus('Saved');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to save SEO');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  async function saveAll() {
    setSaving(true);
    setStatus(null);
    try {
      const payloadPages = (pages ?? []).map((p, pidx) => ({
        name: p.name,
        path: p.path,
        sortOrder: p.sortOrder ?? p.sort_order ?? pidx,
        meta: p.meta ?? {},
        components: (p.components ?? []).map((c, idx) => ({
          type: c.type,
          orderIndex: idx,
          props: c.props ?? {},
          styles: c.styles ?? {},
        })),
      }));

      const [structureResp, settingsResp, seoResp] = await Promise.all([
        api.put(`/websites/${websiteId}/structure`, { pages: payloadPages }),
        api.put(`/websites/${websiteId}/settings`, { settings: website?.settings ?? {} }),
        api.put(`/websites/${websiteId}/seo`, { seo: website?.seo ?? {} }),
      ]);

      setWebsite((prev) => ({
        ...(prev ?? {}),
        ...(structureResp.data.website ?? {}),
        settings: settingsResp.data.website?.settings ?? prev?.settings,
        seo: seoResp.data.website?.seo ?? prev?.seo,
      }));
      setPages(structureResp.data.pages);
      setStatus('Saved');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  function updateActiveComponent(mutator) {
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
      const page = next?.[activePageIndex];
      if (!page) return prev;
      const comp = page.components?.[activeComponentIndex];
      if (!comp) return prev;
      mutator(comp);
      return next;
    });
  }

  function updateActivePage(mutator) {
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
      const page = next?.[activePageIndex];
      if (!page) return prev;
      mutator(page);
      return next;
    });
  }

  function reorderComponents(fromIndex, toIndex) {
    if (fromIndex === null || toIndex === null) return;
    if (fromIndex === toIndex) return;

    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
      const page = next?.[activePageIndex];
      if (!page) return prev;
      const comps = [...(page.components ?? [])];
      if (fromIndex < 0 || fromIndex >= comps.length) return prev;
      if (toIndex < 0 || toIndex >= comps.length) return prev;
      const [moved] = comps.splice(fromIndex, 1);
      comps.splice(toIndex, 0, moved);
      page.components = comps;
      return next;
    });

    setActiveComponentIndex(toIndex);
  }

  function insertComponentAt(index, type) {
    if (!type) return;
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
      const page = next?.[activePageIndex];
      if (!page) return prev;
      const comps = [...(page.components ?? [])];
      const insertionIndex = Math.max(0, Math.min(Number(index), comps.length));
      comps.splice(insertionIndex, 0, {
        type,
        orderIndex: insertionIndex,
        props: defaultPropsForType(type),
        styles: defaultStylesForType(type),
      });
      page.components = comps;
      return next;
    });
    setActiveComponentIndex(Math.max(0, Number(index) || 0));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Editor</div>
          <div className="text-sm text-white/60">{website?.name}</div>
        </div>
        <div className="flex items-center gap-3">
          {status ? <div className="text-sm text-white/60">{status}</div> : null}
          <SmallButton variant="neutral" onClick={saveAll} disabled={saving || !canRender}>
            Save
          </SmallButton>
          <Link
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
            to={`/builder/${websiteId}`}
          >
            Advanced builder
          </Link>
          <Link
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
            to={`/draft-preview/${websiteId}`}
          >
            Preview
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-3">
          <div className="text-sm font-semibold">Pages</div>
          <div className="mt-3 space-y-2">
            <select
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
              value={activePageIndex}
              onChange={(e) => {
                setActivePageIndex(Number(e.target.value));
                setActiveComponentIndex(0);
              }}
            >
              {(pages ?? []).map((p, idx) => (
                <option key={p.id ?? `${p.path}-${idx}`} value={idx}>
                  {p.name} ({p.path})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 space-y-2">
            <TextInput
              label="Page name"
              value={activePage?.name}
              onChange={(v) => updateActivePage((p) => (p.name = v))}
            />
            <TextInput
              label="Page path"
              value={activePage?.path}
              onChange={(v) => updateActivePage((p) => (p.path = v))}
              placeholder="/about"
            />
            <div className="flex gap-2">
              <SmallButton
                onClick={() => {
                  setPages((prev) => {
                    const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
                    next.push({
                      name: `Page ${next.length + 1}`,
                      path: `/page-${next.length + 1}`,
                      sortOrder: next.length,
                      meta: {},
                      components: [],
                    });
                    return next;
                  });
                  setActivePageIndex((pages?.length ?? 0));
                  setActiveComponentIndex(0);
                }}
              >
                Add page
              </SmallButton>
              <SmallButton
                variant="danger"
                disabled={(pages?.length ?? 0) <= 1}
                onClick={() => {
                  setPages((prev) => {
                    const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
                    next.splice(activePageIndex, 1);
                    return next;
                  });
                  setActivePageIndex(0);
                  setActiveComponentIndex(0);
                }}
              >
                Delete page
              </SmallButton>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-semibold">Sections</div>
            <SmallButton
              onClick={() => {
                if (!activePage) return;
                setPages((prev) => {
                  const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
                  const page = next[activePageIndex];
                  const nextComp = {
                    type: addType,
                    orderIndex: (page.components ?? []).length,
                    props: defaultPropsForType(addType),
                    styles: defaultStylesForType(addType),
                  };
                  page.components = [...(page.components ?? []), nextComp];
                  return next;
                });
                setActiveComponentIndex((activePage?.components?.length ?? 0));
              }}
              disabled={!activePage}
            >
              Add
            </SmallButton>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {['HERO', 'FEATURES', 'CONTENT', 'CARDS', 'GALLERY', 'PRICING'].map((t) => (
              <div
                key={t}
                draggable
                onDragStart={() => {
                  setDragNewType(t);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragNewType(null)}
                className="select-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-white/80"
              >
                {t}
              </div>
            ))}
          </div>

          <div className="mt-2">
            <select
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
              value={addType}
              onChange={(e) => setAddType(e.target.value)}
            >
              {componentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 space-y-2">
            {(activePage?.components ?? []).map((c, idx) => (
              <div
                key={c.id ?? `${c.type}-${idx}`}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragNewType) {
                    insertComponentAt(idx, dragNewType);
                    setDragNewType(null);
                    return;
                  }
                  if (dragIndex !== null) {
                    reorderComponents(dragIndex, idx);
                    setDragIndex(null);
                  }
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition cursor-pointer ${
                  idx === activeComponentIndex
                    ? 'border-indigo-400/40 bg-indigo-500/10'
                    : 'border-white/10 bg-black/20 hover:bg-black/30'
                }`}
                onClick={() => setActiveComponentIndex(idx)}
              >
                <div className="flex items-center gap-2">
                  <span className="select-none text-white/50">⋮⋮</span>
                  <span className="font-medium">{c.type}</span>
                </div>
                <span className="text-xs text-white/50">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 lg:col-span-6 overflow-hidden">
          {canRender ? (
            <SiteRenderer
              pages={pages}
              activePageIndex={activePageIndex}
              theme={website?.settings?.theme}
              editor={{
                selectedIndex: activeComponentIndex,
                onSelect: setActiveComponentIndex,
                dragIndex,
                onSetDragIndex: setDragIndex,
                dragNewType,
                onSetDragNewType: setDragNewType,
                hoverIndex,
                onSetHoverIndex: setHoverIndex,
                onMove: reorderComponents,
                onInsert: insertComponentAt,
                onUpdateProps: (componentIndex, patch) => {
                  setPages((prev) => {
                    const next = (prev ?? []).map((p) => ({
                      ...p,
                      components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
                    }));
                    const page = next?.[activePageIndex];
                    const comp = page?.components?.[componentIndex];
                    if (!page || !comp) return prev;
                    comp.props = { ...(comp.props ?? {}), ...(patch ?? {}) };
                    return next;
                  });
                },
              }}
            />
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-3 space-y-6">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Website settings</div>
            <ColorInput
              label="Primary color"
              value={themePrimary}
              onChange={(v) =>
                setWebsite((prev) => ({
                  ...prev,
                  settings: {
                    ...(prev?.settings ?? {}),
                    theme: {
                      ...(prev?.settings?.theme ?? {}),
                      primary: v,
                    },
                  },
                }))
              }
            />
            <ColorInput
              label="Background color"
              value={themeBackground}
              onChange={(v) =>
                setWebsite((prev) => ({
                  ...prev,
                  settings: {
                    ...(prev?.settings ?? {}),
                    theme: {
                      ...(prev?.settings?.theme ?? {}),
                      background: v,
                    },
                  },
                }))
              }
            />
            <SmallButton
              variant="neutral"
              disabled={saving || !website}
              onClick={() => saveSettings(website.settings ?? {})}
            >
              Save settings
            </SmallButton>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">SEO</div>
            <TextInput
              label="Title"
              value={website?.seo?.title ?? ''}
              onChange={(v) => setWebsite((prev) => ({ ...prev, seo: { ...(prev?.seo ?? {}), title: v } }))}
            />
            <TextInput
              label="Description"
              value={website?.seo?.description ?? ''}
              onChange={(v) => setWebsite((prev) => ({ ...prev, seo: { ...(prev?.seo ?? {}), description: v } }))}
            />
            <TextInput
              label="OG image URL"
              value={website?.seo?.ogImage ?? ''}
              onChange={(v) => setWebsite((prev) => ({ ...prev, seo: { ...(prev?.seo ?? {}), ogImage: v } }))}
            />
            <SmallButton variant="neutral" disabled={saving || !website} onClick={() => saveSeo(website.seo ?? {})}>
              Save SEO
            </SmallButton>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Selected section</div>
              {activeComponent ? (
                <div className="flex gap-2">
                  <SmallButton
                    disabled={activeComponentIndex === 0}
                    onClick={() => {
                      setPages((prev) => {
                        const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
                        const comps = next[activePageIndex]?.components ?? [];
                        const i = activeComponentIndex;
                        if (i <= 0) return prev;
                        const tmp = comps[i - 1];
                        comps[i - 1] = comps[i];
                        comps[i] = tmp;
                        return next;
                      });
                      setActiveComponentIndex((i) => Math.max(0, i - 1));
                    }}
                  >
                    Up
                  </SmallButton>
                  <SmallButton
                    disabled={!activePage || activeComponentIndex >= (activePage.components?.length ?? 0) - 1}
                    onClick={() => {
                      setPages((prev) => {
                        const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
                        const comps = next[activePageIndex]?.components ?? [];
                        const i = activeComponentIndex;
                        if (i >= comps.length - 1) return prev;
                        const tmp = comps[i + 1];
                        comps[i + 1] = comps[i];
                        comps[i] = tmp;
                        return next;
                      });
                      setActiveComponentIndex((i) => i + 1);
                    }}
                  >
                    Down
                  </SmallButton>
                  <SmallButton
                    variant="danger"
                    onClick={() => {
                      setPages((prev) => {
                        const next = (prev ?? []).map((p) => ({ ...p, components: (p.components ?? []).map((c) => ({ ...c })) }));
                        const comps = next[activePageIndex]?.components ?? [];
                        comps.splice(activeComponentIndex, 1);
                        return next;
                      });
                      setActiveComponentIndex(0);
                    }}
                  >
                    Delete
                  </SmallButton>
                </div>
              ) : null}
            </div>

            {!activeComponent ? (
              <div className="text-sm text-white/60">Select a section from the left panel.</div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
                  <div className="text-white/60">Type</div>
                  <div className="font-medium">{activeComponent.type}</div>
                </div>

                {activeComponent.type === 'NAVBAR' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Logo text"
                      value={activeComponent.props?.logoText}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), logoText: v }))}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Links</div>
                      {(activeComponent.props?.links ?? []).map((l, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Label"
                            value={l.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links[idx] = { ...links[idx], label: v };
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                          />
                          <TextInput
                            label="Href"
                            value={l.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links[idx] = { ...links[idx], href: v };
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                          >
                            Remove link
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const links = [...(c.props?.links ?? []), { label: 'Link', href: '/' }];
                            c.props = { ...(c.props ?? {}), links };
                          })
                        }
                      >
                        Add link
                      </SmallButton>
                    </div>

                  </div>
                ) : null}

                {activeComponent.type === 'HERO' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                      <div className="text-sm font-semibold">Primary CTA</div>
                      <TextInput
                        label="Label"
                        value={activeComponent.props?.primaryCta?.label}
                        onChange={(v) =>
                          updateActiveComponent((c) =>
                            (c.props = {
                              ...(c.props ?? {}),
                              primaryCta: { ...(c.props?.primaryCta ?? {}), label: v },
                            })
                          )
                        }
                      />
                      <TextInput
                        label="Href"
                        value={activeComponent.props?.primaryCta?.href}
                        onChange={(v) =>
                          updateActiveComponent((c) =>
                            (c.props = {
                              ...(c.props ?? {}),
                              primaryCta: { ...(c.props?.primaryCta ?? {}), href: v },
                            })
                          )
                        }
                      />
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-3">
                      <div className="text-sm font-semibold">Design</div>
                      <ColorInput
                        label="CTA button color"
                        value={activeComponent.styles?.buttonColor ?? themePrimary}
                        onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), buttonColor: v }))}
                      />
                      <ColorInput
                        label="Section background"
                        value={activeComponent.styles?.backgroundColor ?? themeBackground}
                        onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), backgroundColor: v }))}
                      />
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'CARDS' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Cards</div>
                    {(activeComponent.props?.cards ?? []).map((card, idx) => (
                      <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label="Title"
                          value={card.title}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), title: v };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        />
                        <TextInput
                          label="Text"
                          value={card.text}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), text: v };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        />
                        <TextInput
                          label="CTA label"
                          value={card.cta?.label}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), cta: { ...(cards[idx]?.cta ?? {}), label: v } };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        />
                        <TextInput
                          label="CTA href"
                          value={card.cta?.href}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), cta: { ...(cards[idx]?.cta ?? {}), href: v } };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        />
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards.splice(idx, 1);
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        >
                          Remove card
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const cards = [
                            ...(c.props?.cards ?? []),
                            { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
                          ];
                          c.props = { ...(c.props ?? {}), cards };
                        })
                      }
                    >
                      Add card
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'GALLERY' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Images</div>
                    {(activeComponent.props?.images ?? []).map((url, idx) => (
                      <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label={`Image URL #${idx + 1}`}
                          value={url}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const images = [...(c.props?.images ?? [])];
                              images[idx] = v;
                              c.props = { ...(c.props ?? {}), images };
                            })
                          }
                        />
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const images = [...(c.props?.images ?? [])];
                              images.splice(idx, 1);
                              c.props = { ...(c.props ?? {}), images };
                            })
                          }
                        >
                          Remove
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const images = [...(c.props?.images ?? []), 'https://example.com/new-image.jpg'];
                          c.props = { ...(c.props ?? {}), images };
                        })
                      }
                    >
                      Add image
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'PRICING' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Plans</div>
                    {(activeComponent.props?.plans ?? []).map((plan, pidx) => (
                      <div key={pidx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label="Plan name"
                          value={plan.name}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans[pidx] = { ...(plans[pidx] ?? {}), name: v };
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        />
                        <TextInput
                          label="Price"
                          value={plan.price}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans[pidx] = { ...(plans[pidx] ?? {}), price: v };
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        />
                        <TextInput
                          label="Period"
                          value={plan.period}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans[pidx] = { ...(plans[pidx] ?? {}), period: v };
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        />
                        <JsonEditor
                          label="Features (array)"
                          value={plan.features ?? []}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans[pidx] = { ...(plans[pidx] ?? {}), features: Array.isArray(v) ? v : [] };
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        />
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans.splice(pidx, 1);
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        >
                          Remove plan
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const plans = [...(c.props?.plans ?? []), { name: 'New Plan', price: '€0', period: '/mo', features: [] }];
                          c.props = { ...(c.props ?? {}), plans };
                        })
                      }
                    >
                      Add plan
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'FEATURES' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Items</div>
                    {(activeComponent.props?.items ?? []).map((it, idx) => (
                      <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label="Title"
                          value={it.title}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const items = [...(c.props?.items ?? [])];
                              items[idx] = { ...items[idx], title: v };
                              c.props = { ...(c.props ?? {}), items };
                            })
                          }
                        />
                        <TextInput
                          label="Text"
                          value={it.text}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const items = [...(c.props?.items ?? [])];
                              items[idx] = { ...items[idx], text: v };
                              c.props = { ...(c.props ?? {}), items };
                            })
                          }
                        />
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const items = [...(c.props?.items ?? [])];
                              items.splice(idx, 1);
                              c.props = { ...(c.props ?? {}), items };
                            })
                          }
                        >
                          Remove item
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const items = [...(c.props?.items ?? []), { title: 'Feature', text: 'Describe value' }];
                          c.props = { ...(c.props ?? {}), items };
                        })
                      }
                    >
                      Add item
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'CONTENT' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Title"
                      value={activeComponent.props?.title}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), title: v }))}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Paragraphs</div>
                      {(activeComponent.props?.paragraphs ?? []).map((p, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <label className="block">
                            <div className="text-sm text-white/70">Text</div>
                            <textarea
                              value={p}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateActiveComponent((c) => {
                                  const paragraphs = [...(c.props?.paragraphs ?? [])];
                                  paragraphs[idx] = v;
                                  c.props = { ...(c.props ?? {}), paragraphs };
                                });
                              }}
                              className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                              rows={3}
                            />
                          </label>
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const paragraphs = [...(c.props?.paragraphs ?? [])];
                                paragraphs.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), paragraphs };
                              })
                            }
                          >
                            Remove
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const paragraphs = [...(c.props?.paragraphs ?? []), 'New paragraph'];
                            c.props = { ...(c.props ?? {}), paragraphs };
                          })
                        }
                      >
                        Add paragraph
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'CONTACT_FORM' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                  </div>
                ) : null}

                {activeComponent.type === 'FOOTER' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Text"
                      value={activeComponent.props?.text}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), text: v }))}
                    />
                  </div>
                ) : null}

                <JsonEditor
                  label="Advanced: props JSON"
                  value={activeComponent.props}
                  onChange={(v) => updateActiveComponent((c) => (c.props = v))}
                />
                <JsonEditor
                  label="Advanced: styles JSON"
                  value={activeComponent.styles}
                  onChange={(v) => updateActiveComponent((c) => (c.styles = v))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
