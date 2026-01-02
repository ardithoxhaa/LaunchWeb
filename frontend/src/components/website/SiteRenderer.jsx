function NavbarBlock({ props, theme }) {
  const links = props?.links ?? [];
  return (
    <div className="border-b border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="text-sm font-semibold tracking-tight">{props?.logoText ?? 'Website'}</div>
        <div className="flex items-center gap-4 text-sm text-white/75">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroBlock({ props, styles, theme, editorCtx }) {
  const cta = props?.primaryCta;
  const buttonBg = styles?.buttonColor ?? theme?.primary ?? '#6366f1';
  const background = styles?.backgroundColor;
  return (
    <div className="mx-auto max-w-6xl px-4 py-16" style={background ? { backgroundColor: background } : undefined}>
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1
            className="text-4xl font-semibold tracking-tight md:text-5xl"
            contentEditable={!!(editorCtx?.enabled && editorCtx.isSelected)}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!editorCtx?.enabled || !editorCtx.isSelected) return;
              editorCtx.onUpdateProps?.({ headline: e.currentTarget.textContent ?? '' });
            }}
          >
            {props?.headline}
          </h1>
          <p
            className="mt-4 text-white/75"
            contentEditable={!!(editorCtx?.enabled && editorCtx.isSelected)}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!editorCtx?.enabled || !editorCtx.isSelected) return;
              editorCtx.onUpdateProps?.({ subheadline: e.currentTarget.textContent ?? '' });
            }}
          >
            {props?.subheadline}
          </p>
          {cta ? (
            <a
              className="mt-8 inline-flex rounded-md px-4 py-2 text-sm font-medium"
              href={cta.href}
              style={{ backgroundColor: buttonBg }}
            >
              <span
                contentEditable={!!(editorCtx?.enabled && editorCtx.isSelected)}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!editorCtx?.enabled || !editorCtx.isSelected) return;
                  editorCtx.onUpdateProps?.({
                    primaryCta: {
                      ...(props?.primaryCta ?? {}),
                      label: e.currentTarget.textContent ?? '',
                    },
                  });
                }}
              >
                {cta.label}
              </span>
            </a>
          ) : null}
        </div>
        <div className="h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-white/5 to-transparent" />
      </div>
    </div>
  );
}

function FeaturesBlock({ props }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-semibold">{it.title}</div>
            <div className="mt-2 text-sm text-white/70">{it.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentBlock({ props, editorCtx }) {
  const paragraphs = props?.paragraphs ?? [];
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h2
        className="text-3xl font-semibold tracking-tight"
        contentEditable={!!(editorCtx?.enabled && editorCtx.isSelected)}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (!editorCtx?.enabled || !editorCtx.isSelected) return;
          editorCtx.onUpdateProps?.({ title: e.currentTarget.textContent ?? '' });
        }}
      >
        {props?.title}
      </h2>
      <div className="mt-5 space-y-3 text-white/75">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </div>
  );
}

function ContactFormBlock({ props }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">{props?.headline ?? 'Contact'}</h2>
        <form className="mt-6 space-y-4">
          <label className="block">
            <div className="text-sm text-white/70">Name</div>
            <input className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-white/70">Email</div>
            <input className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-white/70">Message</div>
            <textarea className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2" rows={4} />
          </label>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function FooterBlock({ props }) {
  return (
    <div className="border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60">{props?.text ?? ''}</div>
    </div>
  );
}

function CardsBlock({ props }) {
  const cards = props?.cards ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">{c.title}</div>
            <div className="mt-2 text-sm text-white/70">{c.text}</div>
            {c.cta?.label ? (
              <a
                href={c.cta.href ?? '#'}
                className="mt-5 inline-flex rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
              >
                {c.cta.label}
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryBlock({ props }) {
  const images = props?.images ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-3 md:grid-cols-3">
        {images.map((url, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="aspect-[4/3] w-full bg-gradient-to-br from-white/10 to-transparent" />
            <div className="p-3 text-xs text-white/60 break-all">{url}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingBlock({ props }) {
  const plans = props?.plans ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">{p.name}</div>
            <div className="mt-2 flex items-end gap-1">
              <div className="text-3xl font-semibold">{p.price}</div>
              <div className="pb-1 text-sm text-white/60">{p.period ?? ''}</div>
            </div>
            <div className="mt-4 space-y-2">
              {(p.features ?? []).map((f, fidx) => (
                <div key={fidx} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/75">
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RenderComponent({ component, theme, editorCtx }) {
  const type = component.type;
  const props = component.props;
  const styles = component.styles;

  switch (type) {
    case 'NAVBAR':
      return <NavbarBlock props={props} theme={theme} />;
    case 'HERO':
      return <HeroBlock props={props} styles={styles} theme={theme} editorCtx={editorCtx} />;
    case 'FEATURES':
      return <FeaturesBlock props={props} />;
    case 'CONTENT':
      return <ContentBlock props={props} editorCtx={editorCtx} />;
    case 'CONTACT_FORM':
      return <ContactFormBlock props={props} />;
    case 'FOOTER':
      return <FooterBlock props={props} />;
    case 'CARDS':
      return <CardsBlock props={props} />;
    case 'GALLERY':
      return <GalleryBlock props={props} />;
    case 'PRICING':
      return <PricingBlock props={props} />;
    default:
      return (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Unknown component type: {type}
          </div>
        </div>
      );
  }
}

export function SiteRenderer({ pages, activePageIndex = 0, theme, editor }) {
  const page = pages?.[activePageIndex] ?? null;

  if (!page) {
    return <div className="p-6 text-sm text-white/70">No pages yet.</div>;
  }

  const comps = page.components ?? [];

  function DropZone({ index }) {
    const active = editor?.hoverIndex === index;
    return editor ? (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          editor?.onSetHoverIndex?.(index);
        }}
        onDragLeave={() => editor?.onSetHoverIndex?.(null)}
        onDrop={() => {
          if (editor?.dragNewType) {
            editor.onInsert?.(index, editor.dragNewType);
            editor.onSetDragNewType?.(null);
            editor.onSetHoverIndex?.(null);
            return;
          }
          if (editor?.dragIndex !== null && editor?.dragIndex !== undefined) {
            editor.onMove?.(editor.dragIndex, Math.max(0, index - 1));
            editor.onSetDragIndex?.(null);
            editor.onSetHoverIndex?.(null);
          }
        }}
        className={
          active
            ? 'mx-auto max-w-6xl px-4 py-2'
            : 'mx-auto max-w-6xl px-4 py-2 opacity-0 hover:opacity-100 transition'
        }
      >
        <div className={active ? 'h-1 rounded bg-indigo-400/70' : 'h-1 rounded bg-white/20'} />
      </div>
    ) : null;
  }

  return (
    <div style={theme?.background ? { backgroundColor: theme.background } : undefined}>
      {comps.map((c, idx) => {
        const selected = editor?.selectedIndex === idx;

        const onDrop = () => {
          if (!editor) return;
          if (editor.dragNewType) {
            editor.onInsert?.(idx, editor.dragNewType);
            editor.onSetDragNewType?.(null);
            return;
          }
          if (editor.dragIndex !== null && editor.dragIndex !== undefined) {
            editor.onMove?.(editor.dragIndex, idx);
            editor.onSetDragIndex?.(null);
          }
        };

        return (
          <div key={c.id ?? `${c.type}-${c.orderIndex}`}>
            <DropZone index={idx} />
            <div
              draggable={!!editor}
              onDragStart={() => editor?.onSetDragIndex?.(idx)}
              onDragOver={(e) => (editor ? e.preventDefault() : null)}
              onDrop={onDrop}
              onClick={() => editor?.onSelect?.(idx)}
              className={editor ? (selected ? 'outline outline-2 outline-indigo-400/60' : 'outline outline-1 outline-transparent') : ''}
            >
              <RenderComponent
                component={c}
                theme={theme}
                editorCtx={{
                  enabled: !!editor,
                  isSelected: !!selected,
                  onUpdateProps: (patch) => editor?.onUpdateProps?.(idx, patch),
                }}
              />
            </div>
          </div>
        );
      })}

      {editor ? <DropZone index={comps.length} /> : null}

      {editor ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (editor.dragNewType) {
              editor.onInsert?.(comps.length, editor.dragNewType);
              editor.onSetDragNewType?.(null);
              return;
            }
            if (editor.dragIndex !== null && editor.dragIndex !== undefined) {
              editor.onMove?.(editor.dragIndex, comps.length - 1);
              editor.onSetDragIndex?.(null);
            }
          }}
          className="mx-auto max-w-6xl px-4 py-10"
        >
          <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60">
            Drop here to add at the end
          </div>
        </div>
      ) : null}
    </div>
  );
}
