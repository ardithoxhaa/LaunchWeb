import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';

const COMPONENT_TYPES = ['NAVBAR', 'HERO', 'FEATURES', 'CONTENT', 'CARDS', 'GALLERY', 'PRICING', 'CONTACT_FORM', 'FOOTER'];

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
                    <span className="text-xs text-white/50">#{idx + 1}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-white/60">Drag components from the library into the canvas.</div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 lg:col-span-6 overflow-hidden">
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
