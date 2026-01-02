import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';

const COMPONENT_TYPES = [
  'NAVBAR',
  'HERO',
  'FEATURES',
  'CONTENT',
  'CARDS',
  'GALLERY',
  'LOGO_CLOUD',
  'PRODUCT_GRID',
  'FEATURE_CAROUSEL',
  'PRICING',
  'TESTIMONIALS',
  'FAQ',
  'STATS_CTA',
  'CONTACT_FORM',
  'FOOTER',
];

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
    case 'LOGO_CLOUD':
      return {
        label: 'Trusted by',
        logos: [
          { src: '', alt: 'Brand One' },
          { src: '', alt: 'Brand Two' },
          { src: '', alt: 'Brand Three' },
          { src: '', alt: 'Brand Four' },
          { src: '', alt: 'Brand Five' },
          { src: '', alt: 'Brand Six' },
        ],
      };
    case 'PRODUCT_GRID':
      return {
        headline: 'Popular products',
        subheadline: 'Curated picks with transparent pricing.',
        cta: { label: 'View all', href: '/contact' },
        products: [
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€49',
            badge: 'New',
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€79',
            badge: 'Best seller',
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€29',
            badge: null,
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€99',
            badge: null,
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
        ],
      };
    case 'FEATURE_CAROUSEL':
      return {
        headline: 'Featured',
        subheadline: 'A horizontal carousel section (Netflix-style row).',
        cta: { label: 'See all', href: '/contact' },
        items: [
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
        ],
      };
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
    case 'TESTIMONIALS':
      return {
        headline: 'Loved by customers',
        subheadline: 'Real stories from real people.',
        items: [
          { name: 'Alex', role: 'Founder', quote: 'LaunchWeb helped us ship faster.' },
          { name: 'Mina', role: 'Owner', quote: 'The editor is super simple.' },
          { name: 'Sam', role: 'Manager', quote: 'Preview + publish feels professional.' },
        ],
      };
    case 'FAQ':
      return {
        headline: 'FAQ',
        subheadline: 'Quick answers to common questions.',
        items: [
          { q: 'Can I edit everything?', a: 'Yes — sections, text, colors, and layout.' },
          { q: 'Is my data private?', a: 'Yes — templates are cloned per website.' },
          { q: 'Can I unpublish?', a: 'Yes — anytime.' },
        ],
      };
    case 'STATS_CTA':
      return {
        headline: 'Ready to launch?',
        subheadline: 'Publish a site that looks like a real brand.',
        primaryCta: { label: 'Get started', href: '/contact' },
        items: [
          { value: '8–10', label: 'templates' },
          { value: 'Drag & drop', label: 'builder' },
          { value: 'Versioned', label: 'safe edits' },
        ],
      };
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

export function BuilderPage() {
  const { id } = useParams();
  const websiteId = Number(id);

  const [website, setWebsite] = useState(null);
  const [pages, setPages] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragNewType, setDragNewType] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const [previewMode, setPreviewMode] = useState('desktop');

  const [assets, setAssets] = useState([]);
  const [assetsError, setAssetsError] = useState(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);

  function updateActiveComponent(mutator) {
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({
          ...c,
          props: { ...(c.props ?? {}) },
          styles: { ...(c.styles ?? {}) },
        })),
      }));
      const page2 = next?.[activePageIndex];
      const comp = page2?.components?.[activeComponentIndex];
      if (!page2 || !comp) return prev;
      mutator(comp);
      return next;
    });
  }

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

  useEffect(() => {
    let canceled = false;

    async function loadAssets() {
      if (!Number.isFinite(websiteId)) return;
      try {
        setAssetsError(null);
        const { data } = await api.get('/assets', { params: { websiteId } });
        if (!canceled) setAssets(data.assets ?? []);
      } catch (err) {
        if (!canceled) setAssetsError(err?.response?.data?.error?.message ?? 'Failed to load assets');
      }
    }

    loadAssets();

    return () => {
      canceled = true;
    };
  }, [websiteId]);

  function makeAbsoluteAssetUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `http://localhost:5000${url}`;
  }

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

  function reorderComponents(fromIndex, toIndex) {
    if (fromIndex === null || toIndex === null) return;
    if (fromIndex === toIndex) return;

    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
      }));
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

  function duplicateComponentAt(index) {
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
      }));
      const page2 = next?.[activePageIndex];
      if (!page2) return prev;
      const comps2 = [...(page2.components ?? [])];
      const i = Number(index);
      const src = comps2?.[i];
      if (!src) return prev;

      const copy = {
        type: src.type,
        orderIndex: i + 1,
        props: JSON.parse(JSON.stringify(src.props ?? {})),
        styles: JSON.parse(JSON.stringify(src.styles ?? {})),
      };
      comps2.splice(i + 1, 0, copy);
      page2.components = comps2;
      return next;
    });
    setActiveComponentIndex((cur) => {
      const i = Number(index);
      if (!Number.isFinite(i)) return cur;
      return i + 1;
    });
  }

  function duplicateActiveComponent() {
    duplicateComponentAt(activeComponentIndex);
  }

  function insertComponentAt(index, type) {
    if (!type) return;
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
      }));
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

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-2xl font-semibold">Builder</div>
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      </div>
    );
  }

  if (!website || !pages) {
    return (
      <div className="space-y-3">
        <div className="text-2xl font-semibold">Builder</div>
        <div className="text-sm text-white/60">Loading…</div>
      </div>
    );
  }

  const page = pages?.[activePageIndex] ?? null;
  const comps = page?.components ?? [];
  const activeComponent = comps?.[activeComponentIndex] ?? null;

  const previewWidth = previewMode === 'mobile' ? 375 : previewMode === 'tablet' ? 768 : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Builder</div>
          <div className="text-sm text-white/60">{website?.name}</div>
        </div>
        <div className="flex items-center gap-3">
          {status ? <div className="text-sm text-white/60">{status}</div> : null}
          <SmallButton variant="neutral" onClick={() => saveStructure(pages)} disabled={saving}>
            Save
          </SmallButton>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15" to={`/editor/${websiteId}`}>
            Back to editor
          </Link>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15" to={`/draft-preview/${websiteId}`}>
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

          <div className="mt-6">
            <div className="text-sm font-semibold">Component library</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {COMPONENT_TYPES.map((t) => (
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
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold">Canvas layers</div>
            <div className="mt-3 space-y-2">
              {comps.length ? (
                comps.map((c, idx) => (
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
                    onClick={() => setActiveComponentIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition cursor-pointer ${
                      idx === activeComponentIndex
                        ? 'border-indigo-400/40 bg-indigo-500/10'
                        : 'border-white/10 bg-black/20 hover:bg-black/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="select-none text-white/50">⋮⋮</span>
                      <span className="font-medium">{c.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">#{idx + 1}</span>
                      <button
                        type="button"
                        disabled={idx <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderComponents(idx, idx - 1);
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx >= (comps?.length ?? 0) - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderComponents(idx, idx + 1);
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateComponentAt(idx);
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-white/60">Drag components from the library into the canvas.</div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 lg:col-span-6 overflow-hidden">
          <div
            className="mx-auto"
            style={previewWidth ? { width: `${previewWidth}px` } : undefined}
          >
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
                      components: (p.components ?? []).map((c) => ({
                        ...c,
                        props: { ...(c.props ?? {}) },
                        styles: { ...(c.styles ?? {}) },
                      })),
                    }));
                    const page2 = next?.[activePageIndex];
                    const comp = page2?.components?.[componentIndex];
                    if (!page2 || !comp) return prev;
                    comp.props = { ...(comp.props ?? {}), ...(patch ?? {}) };
                    return next;
                  });
                },
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-3 space-y-6">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Selected component</div>
            {!activeComponent ? (
              <div className="text-sm text-white/60">Select a component from the canvas or layers panel.</div>
            ) : (
              <>
                <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
                  <div className="text-white/60">Type</div>
                  <div className="font-medium">{activeComponent.type}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SmallButton disabled={activeComponentIndex <= 0} onClick={() => reorderComponents(activeComponentIndex, activeComponentIndex - 1)}>
                    Move up
                  </SmallButton>
                  <SmallButton
                    disabled={activeComponentIndex >= (comps?.length ?? 0) - 1}
                    onClick={() => reorderComponents(activeComponentIndex, activeComponentIndex + 1)}
                  >
                    Move down
                  </SmallButton>
                  <SmallButton onClick={duplicateActiveComponent}>
                    Duplicate
                  </SmallButton>
                </div>

                <div className="flex items-center gap-1 rounded-md border border-white/10 bg-black/20 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('desktop')}
                    className={
                      previewMode === 'desktop'
                        ? 'rounded-md bg-white/15 px-2 py-1 text-xs font-medium'
                        : 'rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('tablet')}
                    className={
                      previewMode === 'tablet'
                        ? 'rounded-md bg-white/15 px-2 py-1 text-xs font-medium'
                        : 'rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  >
                    Tablet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('mobile')}
                    className={
                      previewMode === 'mobile'
                        ? 'rounded-md bg-white/15 px-2 py-1 text-xs font-medium'
                        : 'rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  >
                    Mobile
                  </button>
                </div>

                {activeComponent.type === 'NAVBAR' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Logo text"
                      value={activeComponent.props?.logoText}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), logoText: v }))}
                    />

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Logo image</div>
                      <div className="flex items-center gap-3">
                        {activeComponent.props?.logoImageUrl ? (
                          <img
                            src={activeComponent.props.logoImageUrl}
                            alt="Logo"
                            className="h-10 w-10 rounded border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded border border-white/10 bg-black/20" />
                        )}
                        <div className="flex-1">
                          <select
                            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={activeComponent.props?.logoImageUrl ?? ''}
                            onChange={(e) =>
                              updateActiveComponent((c) =>
                                (c.props = {
                                  ...(c.props ?? {}),
                                  logoImageUrl: e.target.value ? e.target.value : null,
                                })
                              )
                            }
                          >
                            <option value="">No logo image</option>
                            {(assets ?? []).map((a) => {
                              const fullUrl = makeAbsoluteAssetUrl(a.url);
                              return (
                                <option key={a.id} value={fullUrl}>
                                  {a.meta?.originalName ?? fullUrl}
                                </option>
                              );
                            })}
                          </select>
                          <div className="mt-1 text-xs text-white/50">Upload images in Assets page or in Gallery picker.</div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateActiveComponent((c) =>
                              (c.props = {
                                ...(c.props ?? {}),
                                logoImageUrl: null,
                              })
                            )
                          }
                          className="rounded-md bg-white/10 px-2 py-2 text-xs font-medium text-white/80 hover:bg-white/15"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

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
                            placeholder="/about"
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

                {activeComponent.type === 'LOGO_CLOUD' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Label"
                      value={activeComponent.props?.label}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), label: v }))}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Logos</div>
                      {(activeComponent.props?.logos ?? []).map((l, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Alt text"
                            value={l?.alt}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const logos = [...(c.props?.logos ?? [])];
                                logos[idx] = { ...(logos[idx] ?? {}), alt: v };
                                c.props = { ...(c.props ?? {}), logos };
                              })
                            }
                          />
                          <TextInput
                            label="Image URL"
                            value={l?.src}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const logos = [...(c.props?.logos ?? [])];
                                logos[idx] = { ...(logos[idx] ?? {}), src: v };
                                c.props = { ...(c.props ?? {}), logos };
                              })
                            }
                            placeholder="https://..."
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const logos = [...(c.props?.logos ?? [])];
                                logos.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), logos };
                              })
                            }
                          >
                            Remove logo
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const logos = [...(c.props?.logos ?? []), { src: '', alt: 'New logo' }];
                            c.props = { ...(c.props ?? {}), logos };
                          })
                        }
                      >
                        Add logo
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'PRODUCT_GRID' ? (
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
                      <div className="text-sm font-semibold">CTA</div>
                      <TextInput
                        label="Label"
                        value={activeComponent.props?.cta?.label}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), label: v } }))
                        }
                      />
                      <TextInput
                        label="Href"
                        value={activeComponent.props?.cta?.href}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), href: v } }))
                        }
                        placeholder="/collections"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Products</div>
                      {(activeComponent.props?.products ?? []).map((p, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Name"
                            value={p?.name}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), name: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Description"
                            value={p?.description}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), description: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Price"
                            value={p?.price}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), price: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Badge"
                            value={p?.badge}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), badge: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="New"
                          />
                          <TextInput
                            label="Image URL"
                            value={p?.imageUrl}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), imageUrl: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="https://..."
                          />
                          <TextInput
                            label="Button label"
                            value={p?.cta?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), cta: { ...(products[idx]?.cta ?? {}), label: v } };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Button href"
                            value={p?.cta?.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), cta: { ...(products[idx]?.cta ?? {}), href: v } };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="/contact"
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          >
                            Remove product
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const products = [
                              ...(c.props?.products ?? []),
                              {
                                name: 'Product name',
                                description: 'Short product description',
                                price: '€49',
                                badge: null,
                                imageUrl: '',
                                cta: { label: 'Buy', href: '/contact' },
                              },
                            ];
                            c.props = { ...(c.props ?? {}), products };
                          })
                        }
                      >
                        Add product
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'FEATURE_CAROUSEL' ? (
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
                      <div className="text-sm font-semibold">CTA</div>
                      <TextInput
                        label="Label"
                        value={activeComponent.props?.cta?.label}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), label: v } }))
                        }
                      />
                      <TextInput
                        label="Href"
                        value={activeComponent.props?.cta?.href}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), href: v } }))
                        }
                        placeholder="/browse"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Items</div>
                      {(activeComponent.props?.items ?? []).map((it, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Title"
                            value={it?.title}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), title: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Tagline"
                            value={it?.tagline}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), tagline: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Image URL"
                            value={it?.imageUrl}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), imageUrl: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                            placeholder="https://..."
                          />
                          <TextInput
                            label="Button label"
                            value={it?.cta?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), cta: { ...(items[idx]?.cta ?? {}), label: v } };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Button href"
                            value={it?.cta?.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), cta: { ...(items[idx]?.cta ?? {}), href: v } };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                            placeholder="/contact"
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
                            const items = [
                              ...(c.props?.items ?? []),
                              { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
                            ];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add item
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
                        placeholder="/contact"
                      />
                    </div>
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
                          placeholder="/contact"
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

                    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Asset library</div>
                          <div className="mt-1 text-xs text-white/60">Upload once, reuse in your galleries.</div>
                        </div>
                        <label className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15 cursor-pointer">
                          {uploadingAsset ? 'Uploading…' : 'Upload'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingAsset}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (!file) return;

                              try {
                                setUploadingAsset(true);
                                setAssetsError(null);
                                const fd = new FormData();
                                fd.append('file', file);
                                fd.append('websiteId', String(websiteId));
                                const { data } = await api.post('/assets/upload', fd, {
                                  headers: { 'Content-Type': 'multipart/form-data' },
                                });
                                const created = data.asset;
                                setAssets((prev) => [created, ...(prev ?? [])]);
                              } catch (err) {
                                setAssetsError(err?.response?.data?.error?.message ?? 'Failed to upload');
                              } finally {
                                setUploadingAsset(false);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {assetsError ? <div className="rounded-md bg-red-500/10 p-2 text-xs text-red-200">{assetsError}</div> : null}

                      <div className="grid grid-cols-1 gap-2">
                        {(assets ?? []).slice(0, 8).map((a) => {
                          const fullUrl = makeAbsoluteAssetUrl(a.url);
                          return (
                            <div key={a.id} className="rounded-lg border border-white/10 bg-black/30 p-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="truncate text-xs text-white/70">{a.meta?.originalName ?? fullUrl}</div>
                                  <div className="truncate text-[11px] text-white/40">{fullUrl}</div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText?.(fullUrl);
                                    }}
                                    className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-white/80 hover:bg-white/15"
                                  >
                                    Copy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateActiveComponent((c) => {
                                        const images = [...(c.props?.images ?? []), fullUrl];
                                        c.props = { ...(c.props ?? {}), images };
                                      })
                                    }
                                    className="rounded-md bg-indigo-500 px-2 py-1 text-[11px] font-medium text-white hover:bg-indigo-400"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {!assets?.length ? <div className="text-xs text-white/50">No assets yet.</div> : null}
                      </div>
                    </div>
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
                          placeholder="/mo"
                        />
                        <label className="block">
                          <div className="text-sm text-white/70">Features (one per line)</div>
                          <textarea
                            value={(plan.features ?? []).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').map((x) => x.trim()).filter(Boolean);
                              updateActiveComponent((c) => {
                                const plans = [...(c.props?.plans ?? [])];
                                plans[pidx] = { ...(plans[pidx] ?? {}), features: lines };
                                c.props = { ...(c.props ?? {}), plans };
                              });
                            }}
                            className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            rows={4}
                          />
                        </label>
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

                {activeComponent.type === 'TESTIMONIALS' ? (
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
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Items</div>
                      {(activeComponent.props?.items ?? []).map((t, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Name"
                            value={t.name}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), name: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Role"
                            value={t.role}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), role: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <label className="block">
                            <div className="text-sm text-white/70">Quote</div>
                            <textarea
                              value={t.quote ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateActiveComponent((c) => {
                                  const items = [...(c.props?.items ?? [])];
                                  items[idx] = { ...(items[idx] ?? {}), quote: v };
                                  c.props = { ...(c.props ?? {}), items };
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
                                const items = [...(c.props?.items ?? [])];
                                items.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), items };
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
                            const items = [...(c.props?.items ?? []), { name: 'Customer', role: 'Role', quote: 'Quote' }];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add testimonial
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'FAQ' ? (
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
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Items</div>
                      {(activeComponent.props?.items ?? []).map((f, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Question"
                            value={f.q}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), q: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <label className="block">
                            <div className="text-sm text-white/70">Answer</div>
                            <textarea
                              value={f.a ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateActiveComponent((c) => {
                                  const items = [...(c.props?.items ?? [])];
                                  items[idx] = { ...(items[idx] ?? {}), a: v };
                                  c.props = { ...(c.props ?? {}), items };
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
                                const items = [...(c.props?.items ?? [])];
                                items.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), items };
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
                            const items = [...(c.props?.items ?? []), { q: 'Question', a: 'Answer' }];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add FAQ
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'STATS_CTA' ? (
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
                        placeholder="/contact"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Stats</div>
                      {(activeComponent.props?.items ?? []).map((it, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Value"
                            value={it.value}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), value: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Label"
                            value={it.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), label: v };
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
                            Remove
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const items = [...(c.props?.items ?? []), { value: '100+', label: 'Customers' }];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add stat
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                <SmallButton
                  variant="danger"
                  onClick={() => {
                    setPages((prev) => {
                      const next = (prev ?? []).map((p) => ({
                        ...p,
                        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
                      }));
                      const page2 = next?.[activePageIndex];
                      if (!page2) return prev;
                      const comps2 = [...(page2.components ?? [])];
                      comps2.splice(activeComponentIndex, 1);
                      page2.components = comps2;
                      return next;
                    });
                    setActiveComponentIndex(0);
                  }}
                >
                  Delete component
                </SmallButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
