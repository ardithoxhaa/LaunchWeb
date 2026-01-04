function normalizeBasePath(basePath) {
  if (!basePath) return '';
  const trimmed = String(basePath).trim();
  if (!trimmed) return '';
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

function joinBasePath(basePath, href) {
  const base = normalizeBasePath(basePath);
  const h = String(href ?? '').trim();

  if (!base) return h;
  if (!h) return base || '/';

  if (h.startsWith('/')) return `${base}${h}`;
  if (h.startsWith('#')) return `${base}/${h}`;
  return h;
}

function isExternalHref(href) {
  const h = String(href ?? '').trim().toLowerCase();
  return h.startsWith('http://') || h.startsWith('https://') || h.startsWith('mailto:') || h.startsWith('tel:');
}

function mapHref({ href, linkBasePath }) {
  if (!href) return href;
  if (isExternalHref(href)) return href;

  const h = String(href);

  if (h.startsWith('/')) return joinBasePath(linkBasePath, h);
  if (h.startsWith('#')) return h;
  return h;
}

function NavbarBlock({ props, theme, linkBasePath }) {
  const links = props?.links ?? [];
  return (
    <div className="border-b border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          {props?.logoImageUrl ? (
            <img
              src={props.logoImageUrl}
              alt={props?.logoText ?? 'Logo'}
              className="h-8 w-8 rounded object-cover"
              loading="lazy"
            />
          ) : null}
          <div className="text-sm font-semibold tracking-tight">{props?.logoText ?? 'Website'}</div>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/75">
          {links.map((l) => (
            <a key={l.href} href={mapHref({ href: l.href, linkBasePath })} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdvancedNavbarBlock({ props, theme, linkBasePath }) {
  const links = props?.links ?? [];
  const ctas = props?.ctas ?? [];
  return (
    <div className="border-b border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          {props?.logoImageUrl ? (
            <img
              src={props.logoImageUrl}
              alt={props?.logoText ?? 'Logo'}
              className="h-8 w-8 rounded object-cover"
              loading="lazy"
            />
          ) : null}
          <div className="text-sm font-semibold tracking-tight">{props?.logoText ?? 'Website'}</div>
        </div>

        {props?.showSearch ? (
          <div className="flex w-full flex-1 items-center gap-2 sm:w-auto">
            <input
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 placeholder:text-white/40"
              placeholder={props?.searchPlaceholder ?? 'Search…'}
              readOnly
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
          {links.map((l) => (
            <a
              key={l.href ?? l.label}
              href={mapHref({ href: l.href ?? '#', linkBasePath })}
              className="hover:text-white"
            >
              {l.label}
            </a>
          ))}
          {ctas.map((c, idx) => (
            <a
              key={idx}
              href={mapHref({ href: c.href ?? '#', linkBasePath })}
              className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15"
              style={c.variant === 'primary' ? { backgroundColor: theme?.primary ?? '#6366f1' } : undefined}
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoCloudBlock({ props }) {
  const logos = props?.logos ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-center text-xs font-medium uppercase tracking-wide text-white/60">
          {props?.label ?? 'Trusted by'}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-6">
          {logos.map((l, idx) => (
            <div key={idx} className="flex items-center justify-center rounded-xl border border-white/10 bg-black/20 p-3">
              {l?.src ? (
                <img
                  src={l.src}
                  alt={l.alt ?? `Logo ${idx + 1}`}
                  className="h-7 max-w-full object-contain opacity-90"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-xs text-white/50">{l?.alt ?? 'Logo'}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductGridBlock({ props, theme, linkBasePath }) {
  const products = props?.products ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-3xl font-semibold tracking-tight">{props?.headline ?? 'Products'}</div>
          <div className="mt-2 text-white/70">{props?.subheadline ?? ''}</div>
        </div>
        {props?.cta?.label ? (
          <a
            href={mapHref({ href: props.cta.href ?? '#', linkBasePath })}
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: theme?.primary ?? '#6366f1' }}
          >
            {props.cta.label}
          </a>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="relative aspect-[4/3] w-full bg-black/20">
              {p?.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p?.name ?? `Product ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              {p?.badge ? (
                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/80">
                  {p.badge}
                </div>
              ) : null}
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold">{p?.name ?? 'Product'}</div>
              <div className="mt-1 text-xs text-white/60">{p?.description ?? ''}</div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-white/80">{p?.price ?? ''}</div>
                {p?.cta?.label ? (
                  <a
                    href={mapHref({ href: p.cta.href ?? '#', linkBasePath })}
                    className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15"
                  >
                    {p.cta.label}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCarouselBlock({ props, theme, linkBasePath }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-3xl font-semibold tracking-tight">{props?.headline ?? 'Featured'}</div>
          <div className="mt-2 text-white/70">{props?.subheadline ?? ''}</div>
        </div>
        {props?.cta?.label ? (
          <a
            href={mapHref({ href: props.cta.href ?? '#', linkBasePath })}
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: theme?.primary ?? '#6366f1' }}
          >
            {props.cta.label}
          </a>
        ) : null}
      </div>

      <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="w-64 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="aspect-[16/9] w-full bg-black/20">
              {it?.imageUrl ? (
                <img
                  src={it.imageUrl}
                  alt={it?.title ?? `Item ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <div className="h-full w-full bg-gradient-to-br from-white/10 to-transparent" />
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold">{it?.title ?? 'Title'}</div>
              <div className="mt-1 text-xs text-white/60">{it?.tagline ?? ''}</div>
              {it?.cta?.label ? (
                <a
                  href={mapHref({ href: it.cta.href ?? '#', linkBasePath })}
                  className="mt-4 inline-flex rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15"
                >
                  {it.cta.label}
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterTabsBlock({ props, theme, linkBasePath }) {
  const tabs = props?.tabs ?? [];
  const products = props?.products ?? [];
  const active = props?.defaultTab ?? (tabs?.[0]?.value ?? 'all');

  const filtered =
    active === 'all'
      ? products
      : products.filter((p) => {
          const cats = Array.isArray(p?.categories) ? p.categories : [];
          return cats.includes(active);
        });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-3xl font-semibold tracking-tight">{props?.headline ?? 'Browse'}</div>
      {props?.subheadline ? <div className="mt-2 text-white/70">{props.subheadline}</div> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <div
            key={t.value ?? t.label}
            className={
              (t.value ?? t.label) === active
                ? 'rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white'
                : 'rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70'
            }
            style={(t.value ?? t.label) === active ? { backgroundColor: theme?.primary ?? '#6366f1' } : undefined}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="relative aspect-[4/3] w-full bg-black/20">
              {p?.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p?.name ?? `Product ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              {p?.badge ? (
                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/80">
                  {p.badge}
                </div>
              ) : null}
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold">{p?.name ?? 'Item'}</div>
              <div className="mt-1 text-xs text-white/60">{p?.description ?? ''}</div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-white/80">{p?.price ?? ''}</div>
                {p?.cta?.label ? (
                  <a
                    href={mapHref({ href: p.cta.href ?? '#', linkBasePath })}
                    className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15"
                  >
                    {p.cta.label}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiRowCarouselBlock({ props, theme, linkBasePath }) {
  const rows = props?.rows ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 space-y-10">
      {rows.map((row, ridx) => (
        <div key={ridx}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-lg font-semibold">{row?.title ?? `Row ${ridx + 1}`}</div>
              {row?.subtitle ? <div className="mt-1 text-sm text-white/60">{row.subtitle}</div> : null}
            </div>
            {row?.cta?.label ? (
              <a
                href={mapHref({ href: row.cta.href ?? '#', linkBasePath })}
                className="rounded-md px-4 py-2 text-xs font-medium"
                style={{ backgroundColor: theme?.primary ?? '#6366f1' }}
              >
                {row.cta.label}
              </a>
            ) : null}
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {(row?.items ?? []).map((it, idx) => (
              <a
                key={idx}
                href={mapHref({ href: it?.href ?? '#', linkBasePath })}
                className="min-w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              >
                <div className="aspect-[16/9] w-full bg-black/20">
                  {it?.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it?.title ?? `Item ${idx + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold">{it?.title ?? 'Item'}</div>
                  {it?.tagline ? <div className="mt-1 text-xs text-white/60">{it.tagline}</div> : null}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FooterLinksBlock({ props, linkBasePath }) {
  const columns = props?.columns ?? [];
  return (
    <div className="border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">{props?.brand ?? 'Brand'}</div>
            {props?.description ? <div className="text-sm text-white/60">{props.description}</div> : null}
          </div>
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-sm font-semibold">{col?.title ?? 'Links'}</div>
              <div className="space-y-2 text-sm text-white/70">
                {(col?.links ?? []).map((l, lidx) => (
                  <a key={lidx} href={mapHref({ href: l?.href ?? '#', linkBasePath })} className="block hover:text-white">
                    {l?.label ?? 'Link'}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-xs text-white/50">{props?.copyright ?? '© ' + new Date().getFullYear()}</div>
      </div>
    </div>
  );
}

function TestimonialsBlock({ props }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-3xl font-semibold tracking-tight">{props?.headline ?? 'Testimonials'}</div>
          <div className="mt-2 text-white/70">{props?.subheadline ?? ''}</div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((t, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/75">“{t.quote ?? ''}”</div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="text-sm font-semibold">{t.name ?? 'Customer'}</div>
              <div className="mt-1 text-xs text-white/60">{t.role ?? ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqBlock({ props }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div>
        <div className="text-3xl font-semibold tracking-tight">{props?.headline ?? 'FAQ'}</div>
        <div className="mt-2 text-white/70">{props?.subheadline ?? ''}</div>
      </div>
      <div className="mt-6 grid gap-3">
        {items.map((f, idx) => (
          <details key={idx} className="group rounded-2xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold">
              <div className="flex items-center justify-between gap-4">
                <span>{f.q ?? ''}</span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/60 group-open:hidden">
                  Open
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/60 hidden group-open:inline">
                  Close
                </span>
              </div>
            </summary>
            <div className="mt-3 text-sm text-white/70">{f.a ?? ''}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

function StatsCtaBlock({ props, theme, linkBasePath }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-3xl font-semibold tracking-tight">{props?.headline ?? 'Ready to launch?'}</div>
            <div className="mt-2 text-white/70">{props?.subheadline ?? ''}</div>
          </div>
          {props?.primaryCta?.label ? (
            <a
              href={mapHref({ href: props.primaryCta.href ?? '#', linkBasePath })}
              className="inline-flex rounded-md px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: theme?.primary ?? '#6366f1' }}
            >
              {props.primaryCta.label}
            </a>
          ) : null}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-2xl font-semibold">{it.value ?? ''}</div>
              <div className="mt-1 text-sm text-white/60">{it.label ?? ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroBlock({ props, styles, theme, editorCtx, linkBasePath }) {
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
              href={mapHref({ href: cta.href, linkBasePath })}
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

function HeadingBlock({ props, styles, editorCtx }) {
  const level = Number(props?.level) || 2;
  const Tag = level === 1 ? 'h1' : level === 3 ? 'h3' : level === 4 ? 'h4' : level === 5 ? 'h5' : level === 6 ? 'h6' : 'h2';
  const text = props?.text ?? 'Heading';
  const align = styles?.textAlign ?? props?.align;
  const color = styles?.color;
  const fontSize = styles?.fontSize;
  const fontWeight = styles?.fontWeight;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Tag
        className="font-semibold tracking-tight"
        style={{
          ...(align ? { textAlign: align } : null),
          ...(color ? { color } : null),
          ...(fontSize ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : String(fontSize) } : null),
          ...(fontWeight ? { fontWeight } : null),
        }}
        contentEditable={!!(editorCtx?.enabled && editorCtx.isSelected)}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (!editorCtx?.enabled || !editorCtx.isSelected) return;
          editorCtx.onUpdateProps?.({ text: e.currentTarget.textContent ?? '' });
        }}
      >
        {text}
      </Tag>
    </div>
  );
}

function TextBlock({ props, styles, editorCtx }) {
  const text = props?.text ?? 'Text';
  const align = styles?.textAlign ?? props?.align;
  const color = styles?.color;
  const fontSize = styles?.fontSize;
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div
        className="text-white/75"
        style={{
          ...(align ? { textAlign: align } : null),
          ...(color ? { color } : null),
          ...(fontSize ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : String(fontSize) } : null),
        }}
        contentEditable={!!(editorCtx?.enabled && editorCtx.isSelected)}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (!editorCtx?.enabled || !editorCtx.isSelected) return;
          editorCtx.onUpdateProps?.({ text: e.currentTarget.textContent ?? '' });
        }}
      >
        {text}
      </div>
    </div>
  );
}

function ButtonBlock({ props, styles, theme, linkBasePath, editorCtx }) {
  const label = props?.label ?? 'Button';
  const href = props?.href ?? '#';
  const align = props?.align;
  const bg = styles?.backgroundColor ?? theme?.primary ?? '#6366f1';
  const color = styles?.color ?? '#ffffff';
  const radius = styles?.borderRadius;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6" style={align ? { textAlign: align } : undefined}>
      <a
        href={mapHref({ href, linkBasePath })}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium"
        style={{
          backgroundColor: bg,
          color,
          ...(radius ? { borderRadius: typeof radius === 'number' ? `${radius}px` : String(radius) } : { borderRadius: '10px' }),
        }}
      >
        <span
          contentEditable={!!(editorCtx?.enabled && editorCtx.isSelected)}
          suppressContentEditableWarning
          onBlur={(e) => {
            if (!editorCtx?.enabled || !editorCtx.isSelected) return;
            editorCtx.onUpdateProps?.({ label: e.currentTarget.textContent ?? '' });
          }}
        >
          {label}
        </span>
      </a>
    </div>
  );
}

function DividerBlock({ props, styles }) {
  const color = styles?.color ?? 'rgba(255,255,255,0.12)';
  const thickness = Number(props?.thickness) || 1;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div style={{ height: `${thickness}px`, backgroundColor: color, width: '100%' }} />
    </div>
  );
}

function SpacerBlock({ props }) {
  const h = Number(props?.height);
  const height = Number.isFinite(h) && h > 0 ? h : 24;
  return <div style={{ height: `${height}px` }} />;
}

function ImageBlock({ props, styles }) {
  const src = props?.src ?? '';
  const alt = props?.alt ?? 'Image';
  const width = props?.width;
  const height = props?.height;
  const radius = styles?.borderRadius;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{
            width: width ? (typeof width === 'number' ? `${width}px` : String(width)) : '100%',
            height: height ? (typeof height === 'number' ? `${height}px` : String(height)) : 'auto',
            objectFit: props?.fit ?? 'cover',
            ...(radius ? { borderRadius: typeof radius === 'number' ? `${radius}px` : String(radius) } : null),
          }}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-white/60">No image selected</div>
      )}
    </div>
  );
}

function CardsBlock({ props, linkBasePath }) {
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
                href={mapHref({ href: c.cta.href ?? '#', linkBasePath })}
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
            <div className="aspect-[4/3] w-full">
              <img
                src={url}
                alt={props?.alt ?? `Gallery image ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="h-full w-full bg-gradient-to-br from-white/10 to-transparent" />
            </div>
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

function IconBlock({ props, styles }) {
  const icon = props?.icon ?? '★';
  const size = props?.size ?? 48;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 text-center">
      <span style={{ fontSize: `${size}px`, ...(styles?.color ? { color: styles.color } : {}) }}>{icon}</span>
    </div>
  );
}

function IconBoxBlock({ props, styles }) {
  const icon = props?.icon ?? '★';
  const title = props?.title ?? 'Icon Box';
  const text = props?.text ?? '';
  const align = props?.align ?? 'center';
  return (
    <div className="mx-auto max-w-6xl px-4 py-6" style={{ textAlign: align }}>
      <div className="inline-flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-4xl mb-3" style={styles?.color ? { color: styles.color } : {}}>{icon}</div>
        <div className="text-lg font-semibold">{title}</div>
        <div className="mt-2 text-sm text-white/70">{text}</div>
      </div>
    </div>
  );
}

function StarRatingBlock({ props, styles }) {
  const rating = props?.rating ?? 4;
  const maxRating = props?.maxRating ?? 5;
  const size = props?.size ?? 24;
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 flex gap-1 justify-center">
      {Array.from({ length: maxRating }).map((_, i) => (
        <span key={i} style={{ fontSize: `${size}px`, color: i < rating ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}>★</span>
      ))}
    </div>
  );
}

function VideoBlock({ props, styles }) {
  const url = props?.url ?? '';
  const aspectRatio = props?.aspectRatio ?? '16:9';
  const [w, h] = aspectRatio.split(':').map(Number);
  const paddingTop = h && w ? `${(h / w) * 100}%` : '56.25%';
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ paddingTop }}>
        {url ? (
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white/50">No video URL</div>
        )}
      </div>
    </div>
  );
}

function IconListBlock({ props, styles }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-lg" style={styles?.color ? { color: styles.color } : { color: '#22c55e' }}>{item.icon ?? '✓'}</span>
            <span className="text-white/80">{item.text ?? ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageBoxBlock({ props, styles }) {
  const src = props?.src ?? '';
  const title = props?.title ?? '';
  const text = props?.text ?? '';
  const overlay = props?.overlay !== false;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="relative rounded-2xl overflow-hidden border border-white/10">
        <div className="aspect-video w-full bg-black/30">
          {src ? <img src={src} alt={title} className="w-full h-full object-cover" /> : null}
        </div>
        {overlay && (title || text) ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            {title ? <div className="text-xl font-semibold">{title}</div> : null}
            {text ? <div className="mt-1 text-sm text-white/70">{text}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MenuBlock({ props, linkBasePath }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <nav className="flex flex-wrap gap-4">
        {items.map((item, idx) => (
          <a key={idx} href={mapHref({ href: item.href ?? '#', linkBasePath })} className="text-sm text-white/70 hover:text-white">
            {item.label ?? 'Link'}
          </a>
        ))}
      </nav>
    </div>
  );
}

function BreadcrumbsBlock({ props, linkBasePath }) {
  const items = props?.items ?? [];
  const separator = props?.separator ?? '/';
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <nav className="flex items-center gap-2 text-sm">
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {idx > 0 ? <span className="text-white/40">{separator}</span> : null}
            <a href={mapHref({ href: item.href ?? '#', linkBasePath })} className="text-white/70 hover:text-white">
              {item.label ?? 'Page'}
            </a>
          </span>
        ))}
      </nav>
    </div>
  );
}

function PageHeaderBlock({ props, styles }) {
  const title = props?.title ?? 'Page Title';
  const subtitle = props?.subtitle ?? '';
  const bgImage = props?.backgroundImage;
  return (
    <div 
      className="relative py-20 px-4"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : { backgroundColor: 'rgba(0,0,0,0.3)' }),
      }}
    >
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle ? <p className="mt-3 text-lg text-white/70">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function CallToActionBlock({ props, theme, linkBasePath }) {
  const headline = props?.headline ?? 'Ready to get started?';
  const text = props?.text ?? '';
  const primaryCta = props?.primaryCta;
  const secondaryCta = props?.secondaryCta;
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-10 text-center">
        <h2 className="text-3xl font-bold">{headline}</h2>
        {text ? <p className="mt-3 text-white/70">{text}</p> : null}
        <div className="mt-6 flex justify-center gap-4">
          {primaryCta?.label ? (
            <a href={mapHref({ href: primaryCta.href ?? '#', linkBasePath })} className="rounded-lg px-6 py-3 font-medium" style={{ backgroundColor: theme?.primary ?? '#6366f1' }}>
              {primaryCta.label}
            </a>
          ) : null}
          {secondaryCta?.label ? (
            <a href={mapHref({ href: secondaryCta.href ?? '#', linkBasePath })} className="rounded-lg border border-white/20 px-6 py-3 font-medium hover:bg-white/10">
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function IconCardsBlock({ props, styles }) {
  const cards = props?.cards ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-4xl mb-4">{card.icon ?? '★'}</div>
            <div className="text-lg font-semibold">{card.title ?? 'Card'}</div>
            <div className="mt-2 text-sm text-white/70">{card.text ?? ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamBlock({ props }) {
  const headline = props?.headline ?? 'Our Team';
  const members = props?.members ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">{headline}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {members.map((m, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 mb-4 overflow-hidden">
              {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="font-semibold">{m.name ?? 'Name'}</div>
            <div className="text-sm text-white/60">{m.role ?? 'Role'}</div>
            {m.bio ? <div className="mt-2 text-xs text-white/50">{m.bio}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutBlock({ props, styles }) {
  const headline = props?.headline ?? 'About Us';
  const text = props?.text ?? '';
  const image = props?.image;
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold">{headline}</h2>
          <p className="mt-4 text-white/70">{text}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 aspect-video overflow-hidden">
          {image ? <img src={image} alt={headline} className="w-full h-full object-cover" /> : null}
        </div>
      </div>
    </div>
  );
}

function ReviewsBlock({ props }) {
  const headline = props?.headline ?? 'Reviews';
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">{headline}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((r, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < (r.rating ?? 5) ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}>★</span>
              ))}
            </div>
            <p className="text-sm text-white/70">"{r.text ?? ''}"</p>
            <div className="mt-4 text-sm font-semibold">{r.name ?? 'Customer'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CounterBlock({ props, styles }) {
  const value = props?.value ?? 0;
  const suffix = props?.suffix ?? '';
  const label = props?.label ?? '';
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-center">
      <div className="text-5xl font-bold" style={styles?.color ? { color: styles.color } : { color: '#6366f1' }}>
        {value}{suffix}
      </div>
      <div className="mt-2 text-white/60">{label}</div>
    </div>
  );
}

function AccordionBlock({ props }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="space-y-2">
        {items.map((item, idx) => (
          <details key={idx} className="group rounded-xl border border-white/10 bg-white/5">
            <summary className="cursor-pointer p-4 font-medium">{item.title ?? 'Section'}</summary>
            <div className="px-4 pb-4 text-sm text-white/70">{item.content ?? ''}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

function TabsBlock({ props }) {
  const tabs = props?.tabs ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {tabs.map((tab, idx) => (
          <button key={idx} className={`px-4 py-2 text-sm rounded-t-lg ${idx === 0 ? 'bg-white/10' : 'hover:bg-white/5'}`}>
            {tab.label ?? 'Tab'}
          </button>
        ))}
      </div>
      <div className="p-4 text-white/70">{tabs[0]?.content ?? ''}</div>
    </div>
  );
}

function ToggleBlock({ props }) {
  const label = props?.label ?? 'Toggle';
  const checked = props?.defaultChecked ?? false;
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <div className={`w-12 h-6 rounded-full ${checked ? 'bg-indigo-500' : 'bg-white/20'} relative`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'}`} />
        </div>
        <span className="text-white/80">{label}</span>
      </label>
    </div>
  );
}

function TestimonialSliderBlock({ props }) {
  const items = props?.items ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {items.map((t, idx) => (
          <div key={idx} className="min-w-[300px] rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/70">"{t.quote ?? ''}"</p>
            <div className="mt-4 font-semibold">{t.name ?? 'Customer'}</div>
            <div className="text-sm text-white/50">{t.role ?? ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageCarouselBlock({ props }) {
  const images = props?.images ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {images.map((img, idx) => (
          <div key={idx} className="min-w-[300px] rounded-xl border border-white/10 overflow-hidden">
            {img.src ? <img src={img.src} alt={img.alt ?? `Image ${idx + 1}`} className="w-full h-48 object-cover" /> : (
              <div className="w-full h-48 bg-black/30 flex items-center justify-center text-white/40">No image</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterBlock({ props, theme }) {
  const headline = props?.headline ?? 'Subscribe';
  const placeholder = props?.placeholder ?? 'Enter your email';
  const buttonLabel = props?.buttonLabel ?? 'Subscribe';
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h3 className="text-2xl font-bold">{headline}</h3>
        <div className="mt-6 flex max-w-md mx-auto gap-2">
          <input type="email" placeholder={placeholder} className="flex-1 rounded-lg border border-white/10 bg-black/30 px-4 py-3" />
          <button className="rounded-lg px-6 py-3 font-medium" style={{ backgroundColor: theme?.primary ?? '#6366f1' }}>{buttonLabel}</button>
        </div>
      </div>
    </div>
  );
}

function SearchBoxBlock({ props }) {
  const placeholder = props?.placeholder ?? 'Search...';
  const buttonLabel = props?.buttonLabel ?? 'Search';
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="flex gap-2 max-w-md">
        <input type="text" placeholder={placeholder} className="flex-1 rounded-lg border border-white/10 bg-black/30 px-4 py-2" />
        <button className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20">{buttonLabel}</button>
      </div>
    </div>
  );
}

function SocialIconsBlock({ props }) {
  const icons = props?.icons ?? [];
  const platformIcons = { twitter: '𝕏', facebook: 'f', instagram: '📷', linkedin: 'in', youtube: '▶', tiktok: '♪' };
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="flex gap-3 justify-center">
        {icons.map((icon, idx) => (
          <a key={idx} href={icon.url ?? '#'} className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10">
            {platformIcons[icon.platform] ?? '●'}
          </a>
        ))}
      </div>
    </div>
  );
}

function CopyrightBlock({ props }) {
  const text = props?.text ?? `© ${new Date().getFullYear()} All rights reserved.`;
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm text-white/50">{text}</div>
  );
}

function PriceTableBlock({ props }) {
  const plans = props?.plans ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">{plan.name ?? 'Plan'}</div>
            <div className="mt-2 text-3xl font-bold">{plan.price ?? '$0'}</div>
            <div className="mt-4 space-y-2">
              {(plan.features ?? []).map((f, fidx) => (
                <div key={fidx} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-green-400">✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RenderComponent({ component, theme, editorCtx, linkBasePath }) {
  const type = component.type;
  const props = component.props;
  const styles = component.styles;

  switch (type) {
    case 'NAVBAR':
      return <NavbarBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'ADVANCED_NAVBAR':
      return <AdvancedNavbarBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'HERO':
      return <HeroBlock props={props} styles={styles} theme={theme} editorCtx={editorCtx} linkBasePath={linkBasePath} />;
    case 'FEATURES':
      return <FeaturesBlock props={props} />;
    case 'CONTENT':
      return <ContentBlock props={props} editorCtx={editorCtx} />;
    case 'CONTACT_FORM':
      return <ContactFormBlock props={props} />;
    case 'FOOTER':
      return <FooterBlock props={props} />;
    case 'CARDS':
      return <CardsBlock props={props} linkBasePath={linkBasePath} />;
    case 'GALLERY':
      return <GalleryBlock props={props} />;
    case 'LOGO_CLOUD':
      return <LogoCloudBlock props={props} />;
    case 'PRICING':
      return <PricingBlock props={props} />;
    case 'TESTIMONIALS':
      return <TestimonialsBlock props={props} />;
    case 'FAQ':
      return <FaqBlock props={props} />;
    case 'STATS_CTA':
      return <StatsCtaBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'PRODUCT_GRID':
      return <ProductGridBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'FILTER_TABS':
      return <FilterTabsBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'FEATURE_CAROUSEL':
      return <FeatureCarouselBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'MULTI_ROW_CAROUSEL':
      return <MultiRowCarouselBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'FOOTER_LINKS':
      return <FooterLinksBlock props={props} linkBasePath={linkBasePath} />;
    case 'HEADING':
      return <HeadingBlock props={props} styles={styles} editorCtx={editorCtx} />;
    case 'TEXT':
      return <TextBlock props={props} styles={styles} editorCtx={editorCtx} />;
    case 'BUTTON':
      return <ButtonBlock props={props} styles={styles} theme={theme} linkBasePath={linkBasePath} editorCtx={editorCtx} />;
    case 'DIVIDER':
      return <DividerBlock props={props} styles={styles} />;
    case 'SPACER':
      return <SpacerBlock props={props} />;
    case 'IMAGE':
      return <ImageBlock props={props} styles={styles} />;
    case 'ICON':
      return <IconBlock props={props} styles={styles} />;
    case 'ICON_BOX':
      return <IconBoxBlock props={props} styles={styles} />;
    case 'STAR_RATING':
      return <StarRatingBlock props={props} styles={styles} />;
    case 'VIDEO':
      return <VideoBlock props={props} styles={styles} />;
    case 'ICON_LIST':
      return <IconListBlock props={props} styles={styles} />;
    case 'IMAGE_BOX':
      return <ImageBoxBlock props={props} styles={styles} />;
    case 'MENU':
      return <MenuBlock props={props} linkBasePath={linkBasePath} />;
    case 'BREADCRUMBS':
      return <BreadcrumbsBlock props={props} linkBasePath={linkBasePath} />;
    case 'PAGE_HEADER':
      return <PageHeaderBlock props={props} styles={styles} />;
    case 'CALL_TO_ACTION':
      return <CallToActionBlock props={props} theme={theme} linkBasePath={linkBasePath} />;
    case 'ICON_CARDS':
      return <IconCardsBlock props={props} styles={styles} />;
    case 'TEAM':
      return <TeamBlock props={props} />;
    case 'ABOUT':
      return <AboutBlock props={props} styles={styles} />;
    case 'REVIEWS':
      return <ReviewsBlock props={props} />;
    case 'COUNTER':
      return <CounterBlock props={props} styles={styles} />;
    case 'ACCORDION':
      return <AccordionBlock props={props} />;
    case 'TABS':
      return <TabsBlock props={props} />;
    case 'TOGGLE':
      return <ToggleBlock props={props} />;
    case 'TESTIMONIAL_SLIDER':
      return <TestimonialSliderBlock props={props} />;
    case 'IMAGE_CAROUSEL':
      return <ImageCarouselBlock props={props} />;
    case 'NEWSLETTER':
      return <NewsletterBlock props={props} theme={theme} />;
    case 'SEARCH_BOX':
      return <SearchBoxBlock props={props} />;
    case 'SOCIAL_ICONS':
      return <SocialIconsBlock props={props} />;
    case 'COPYRIGHT':
      return <CopyrightBlock props={props} />;
    case 'PRICE_TABLE':
      return <PriceTableBlock props={props} />;
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

export function SiteRenderer({ pages, activePageIndex = 0, theme, designSystem, editor, linkBasePath }) {
  const page = pages?.[activePageIndex] ?? null;

  if (!page) {
    return <div className="p-6 text-sm text-white/70">No pages yet.</div>;
  }

  const comps = page.components ?? [];

  function findFirstNodeByType(builder, type) {
    const root = builder?.root;
    if (!root) return null;

    let found = null;
    function walk(node) {
      if (!node || found) return;
      if (node.type === type) {
        found = node;
        return;
      }
      const children = Array.isArray(node.children) ? node.children : [];
      for (const ch of children) walk(ch);
    }
    walk(root);
    return found;
  }

  function getColumns(builder) {
    const root = builder?.root;
    if (!root) return [];

    let container = null;
    function walk(node) {
      if (!node || container) return;
      if (node.type === 'CONTAINER') {
        container = node;
        return;
      }
      const children = Array.isArray(node.children) ? node.children : [];
      for (const ch of children) walk(ch);
    }
    walk(root);

    if (!container) return [];
    return (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  }

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

  const rootStyle = {
    ...(designSystem?.typography?.fontFamily ? { fontFamily: designSystem.typography.fontFamily } : null),
    ...(designSystem?.typography?.baseFontSize ? { fontSize: `${designSystem.typography.baseFontSize}px` } : null),
    ...(designSystem?.typography?.lineHeight ? { lineHeight: String(designSystem.typography.lineHeight) } : null),
    ...(designSystem?.colors?.text ? { color: designSystem.colors.text } : null),
    ...((theme?.background ?? designSystem?.colors?.background)
      ? { backgroundColor: theme?.background ?? designSystem?.colors?.background }
      : null),
  };

  const builder = page?.builder ?? null;

  function computeBuilderWrapperStyle(node, { defaultPaddingX, defaultPaddingY } = {}) {
    const s = node?.style ?? {};

    const wrapperStyle = {
      ...(s?.backgroundColor ? { backgroundColor: s.backgroundColor } : null),
    };

    if (s?.marginTop !== null && s?.marginTop !== undefined && s?.marginTop !== '') {
      wrapperStyle.marginTop = `${Number(s.marginTop)}px`;
    }
    if (s?.marginBottom !== null && s?.marginBottom !== undefined && s?.marginBottom !== '') {
      wrapperStyle.marginBottom = `${Number(s.marginBottom)}px`;
    }

    const paddingTop =
      s?.paddingTop !== null && s?.paddingTop !== undefined && s?.paddingTop !== ''
        ? Number(s.paddingTop)
        : Number.isFinite(Number(defaultPaddingY))
          ? Number(defaultPaddingY)
          : null;
    const paddingBottom =
      s?.paddingBottom !== null && s?.paddingBottom !== undefined && s?.paddingBottom !== ''
        ? Number(s.paddingBottom)
        : Number.isFinite(Number(defaultPaddingY))
          ? Number(defaultPaddingY)
          : null;
    const paddingLeft =
      s?.paddingLeft !== null && s?.paddingLeft !== undefined && s?.paddingLeft !== ''
        ? Number(s.paddingLeft)
        : Number.isFinite(Number(defaultPaddingX))
          ? Number(defaultPaddingX)
          : null;
    const paddingRight =
      s?.paddingRight !== null && s?.paddingRight !== undefined && s?.paddingRight !== ''
        ? Number(s.paddingRight)
        : Number.isFinite(Number(defaultPaddingX))
          ? Number(defaultPaddingX)
          : null;

    if (Number.isFinite(paddingTop)) wrapperStyle.paddingTop = `${paddingTop}px`;
    if (Number.isFinite(paddingBottom)) wrapperStyle.paddingBottom = `${paddingBottom}px`;
    if (Number.isFinite(paddingLeft)) wrapperStyle.paddingLeft = `${paddingLeft}px`;
    if (Number.isFinite(paddingRight)) wrapperStyle.paddingRight = `${paddingRight}px`;

    return wrapperStyle;
  }

  const sectionY = Number(designSystem?.spacing?.sectionY);
  const containerX = Number(designSystem?.spacing?.containerX);

  function computeSectionStyle(node) {
    return node ? computeBuilderWrapperStyle(node, { defaultPaddingY: sectionY }) : null;
  }

  function computeContainerStyle(node) {
    if (!node) return null;
    const containerBoxed = node?.props?.width !== 'full';
    return {
      ...(containerBoxed ? { maxWidth: '72rem', marginLeft: 'auto', marginRight: 'auto' } : null),
      ...computeBuilderWrapperStyle(node, { defaultPaddingX: containerX }),
    };
  }

  function nodeToComponent(node) {
    return {
      id: node?.id,
      type: node?.widgetType,
      props: node?.props ?? {},
      styles: node?.style ?? {},
    };
  }

  function computeComponentWrapperStyle(component) {
    const s = component?.styles ?? {};
    const sectionY = Number(designSystem?.spacing?.sectionY);
    const containerX = Number(designSystem?.spacing?.containerX);

    const wrapperStyle = {
      ...(s?.backgroundColor ? { backgroundColor: s.backgroundColor } : null),
    };

    if (s?.marginTop !== null && s?.marginTop !== undefined && s?.marginTop !== '') {
      wrapperStyle.marginTop = `${Number(s.marginTop)}px`;
    }
    if (s?.marginBottom !== null && s?.marginBottom !== undefined && s?.marginBottom !== '') {
      wrapperStyle.marginBottom = `${Number(s.marginBottom)}px`;
    }

    const paddingTop =
      s?.paddingTop !== null && s?.paddingTop !== undefined && s?.paddingTop !== ''
        ? Number(s.paddingTop)
        : Number.isFinite(sectionY)
          ? sectionY
          : null;
    const paddingBottom =
      s?.paddingBottom !== null && s?.paddingBottom !== undefined && s?.paddingBottom !== ''
        ? Number(s.paddingBottom)
        : Number.isFinite(sectionY)
          ? sectionY
          : null;

    if (Number.isFinite(paddingTop)) wrapperStyle.paddingTop = `${paddingTop}px`;
    if (Number.isFinite(paddingBottom)) wrapperStyle.paddingBottom = `${paddingBottom}px`;

    if (Number.isFinite(containerX)) {
      wrapperStyle.paddingLeft = `${containerX}px`;
      wrapperStyle.paddingRight = `${containerX}px`;
    }

    return wrapperStyle;
  }


  const forceColumnIndex = editor?.columnId !== null && editor?.columnId !== undefined ? Number(editor.columnId) : null;

  // Preserve existing 2-column preview behavior when the caller provides a forced column index.
  if (Number.isFinite(forceColumnIndex)) {
    const sectionNode = builder ? findFirstNodeByType(builder, 'SECTION') : null;
    const containerNode = builder ? findFirstNodeByType(builder, 'CONTAINER') : null;
    const columns = builder ? getColumns(builder) : [];
    const columnNode = columns?.[forceColumnIndex] ?? null;

    const sectionStyle = computeSectionStyle(sectionNode);
    const containerStyle = computeContainerStyle(containerNode);
    const columnStyle = columnNode ? computeBuilderWrapperStyle(columnNode) : null;

    return (
      <div style={rootStyle}>
        <div
          style={sectionStyle ?? undefined}
          onContextMenu={(e) => {
            if (!editor?.onContextMenu || !sectionNode?.id) return;
            e.preventDefault();
            e.stopPropagation();
            editor.onContextMenu({ nodeType: 'SECTION', nodeId: sectionNode.id, columnIndex: forceColumnIndex, x: e.clientX, y: e.clientY });
          }}
        >
          <div
            style={containerStyle ?? undefined}
            onContextMenu={(e) => {
              if (!editor?.onContextMenu || !containerNode?.id) return;
              e.preventDefault();
              e.stopPropagation();
              editor.onContextMenu({ nodeType: 'CONTAINER', nodeId: containerNode.id, columnIndex: forceColumnIndex, x: e.clientX, y: e.clientY });
            }}
          >
            <div
              style={columnStyle ?? undefined}
              onContextMenu={(e) => {
                if (!editor?.onContextMenu || !columnNode?.id) return;
                e.preventDefault();
                e.stopPropagation();
                editor.onContextMenu({ nodeType: 'COLUMN', nodeId: columnNode.id, columnIndex: forceColumnIndex, x: e.clientX, y: e.clientY });
              }}
            >
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
                      data-builder-comp-idx={editor ? idx : undefined}
                      data-builder-col={forceColumnIndex}
                      draggable={!!editor}
                      onDragStart={() => editor?.onSetDragIndex?.(idx)}
                      onDragOver={(e) => (editor ? e.preventDefault() : null)}
                      onDrop={onDrop}
                      onClick={() => editor?.onSelect?.(idx)}
                      onContextMenu={(e) => {
                        if (!editor?.onContextMenu) return;
                        e.preventDefault();
                        editor.onContextMenu({
                          componentIndex: idx,
                          columnIndex: forceColumnIndex,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      className={
                        editor ? (selected ? 'outline outline-2 outline-indigo-400/60' : 'outline outline-1 outline-transparent') : ''
                      }
                    >
                      <div style={computeComponentWrapperStyle(c)}>
                        <RenderComponent
                          component={c}
                          theme={theme}
                          linkBasePath={linkBasePath}
                          editorCtx={{
                            enabled: !!editor,
                            isSelected: !!selected,
                            onUpdateProps: (patch) => editor?.onUpdateProps?.(idx, patch),
                          }}
                        />
                      </div>
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
          </div>
        </div>
      </div>
    );
  }

  // Multi-section rendering from builder tree.
  const root = builder?.root ?? null;
  const sections = (root?.children ?? []).filter((n) => n?.type === 'SECTION');

  if (!sections.length) {
    // Fall back to previous flat rendering when there's no builder hierarchy.
    return (
      <div style={rootStyle}>
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
                data-builder-comp-idx={editor ? idx : undefined}
                draggable={!!editor}
                onDragStart={() => editor?.onSetDragIndex?.(idx)}
                onDragOver={(e) => (editor ? e.preventDefault() : null)}
                onDrop={onDrop}
                onClick={() => editor?.onSelect?.(idx)}
                onContextMenu={(e) => {
                  if (!editor?.onContextMenu) return;
                  e.preventDefault();
                  editor.onContextMenu({ componentIndex: idx, columnIndex: 0, x: e.clientX, y: e.clientY });
                }}
                className={editor ? (selected ? 'outline outline-2 outline-indigo-400/60' : 'outline outline-1 outline-transparent') : ''}
              >
                <div style={computeComponentWrapperStyle(c)}>
                  <RenderComponent
                    component={c}
                    theme={theme}
                    linkBasePath={linkBasePath}
                    editorCtx={{
                      enabled: !!editor,
                      isSelected: !!selected,
                      onUpdateProps: (patch) => editor?.onUpdateProps?.(idx, patch),
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {editor ? <DropZone index={comps.length} /> : null}
      </div>
    );
  }

  let globalWidgetIndex = 0;

  function renderWidgetNode(widgetNode, keyPrefix) {
    const idx = globalWidgetIndex;
    globalWidgetIndex += 1;
    const c = nodeToComponent(widgetNode);
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
      <div key={`${keyPrefix}-w-${c.id ?? idx}`}>
        <DropZone index={idx} />
        <div
          data-builder-comp-idx={editor ? idx : undefined}
          draggable={!!editor}
          onDragStart={() => editor?.onSetDragIndex?.(idx)}
          onDragOver={(e) => (editor ? e.preventDefault() : null)}
          onDrop={onDrop}
          onClick={() => editor?.onSelect?.(idx)}
          onContextMenu={(e) => {
            if (!editor?.onContextMenu) return;
            e.preventDefault();
            editor.onContextMenu({ componentIndex: idx, columnIndex: 0, x: e.clientX, y: e.clientY });
          }}
          className={editor ? (selected ? 'outline outline-2 outline-indigo-400/60' : 'outline outline-1 outline-transparent') : ''}
        >
          <div style={computeComponentWrapperStyle(c)}>
            <RenderComponent
              component={c}
              theme={theme}
              linkBasePath={linkBasePath}
              editorCtx={{
                enabled: !!editor,
                isSelected: !!selected,
                onUpdateProps: (patch) => editor?.onUpdateProps?.(idx, patch),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      {sections.map((sectionNode, sidx) => {
        const sectionStyle = computeSectionStyle(sectionNode);
        const containers = (sectionNode?.children ?? []).filter((n) => n?.type === 'CONTAINER');
        const effectiveContainers = containers.length ? containers : [null];

        return (
          <div
            key={sectionNode?.id ?? `section-${sidx}`}
            style={sectionStyle ?? undefined}
            onContextMenu={(e) => {
              if (!editor?.onContextMenu || !sectionNode?.id) return;
              e.preventDefault();
              e.stopPropagation();
              editor.onContextMenu({ nodeType: 'SECTION', nodeId: sectionNode.id, columnIndex: 0, x: e.clientX, y: e.clientY });
            }}
          >
            {effectiveContainers.map((containerNode, cidx) => {
              const containerStyle = computeContainerStyle(containerNode);
              const containerChildren = containerNode ? containerNode.children ?? [] : sectionNode?.children ?? [];
              const columns = (containerChildren ?? []).filter((n) => n?.type === 'COLUMN');
              const effectiveColumns = columns.length
                ? columns
                : [
                    {
                      id: containerNode?.id ? `${containerNode.id}:__singlecol` : `section-${sidx}:__singlecol`,
                      type: 'COLUMN',
                      props: { width: 12 },
                      style: {},
                      children: (containerChildren ?? []).filter((n) => n?.type === 'WIDGET'),
                    },
                  ];

              const shouldGrid = effectiveColumns.length > 1;

              return (
                <div
                  key={containerNode?.id ?? `container-${sidx}-${cidx}`}
                  style={containerStyle ?? undefined}
                  onContextMenu={(e) => {
                    if (!editor?.onContextMenu || !containerNode?.id) return;
                    e.preventDefault();
                    e.stopPropagation();
                    editor.onContextMenu({ nodeType: 'CONTAINER', nodeId: containerNode.id, columnIndex: 0, x: e.clientX, y: e.clientY });
                  }}
                >
                  <div className={shouldGrid ? 'grid grid-cols-12 gap-6' : ''}>
                    {effectiveColumns.map((colNode, colIdx) => {
                      const colWidth = Number(colNode?.props?.width);
                      const gridColStyle = shouldGrid && Number.isFinite(colWidth) ? { gridColumn: `span ${colWidth} / span ${colWidth}` } : null;
                      const colStyle = colNode ? computeBuilderWrapperStyle(colNode) : null;
                      const widgets = (colNode?.children ?? []).filter((n) => n?.type === 'WIDGET');
                      return (
                        <div
                          key={colNode?.id ?? `col-${sidx}-${cidx}-${colIdx}`}
                          style={{ ...(gridColStyle ?? null), ...(colStyle ?? null) }}
                          onContextMenu={(e) => {
                            if (!editor?.onContextMenu || !colNode?.id) return;
                            e.preventDefault();
                            e.stopPropagation();
                            editor.onContextMenu({ nodeType: 'COLUMN', nodeId: colNode.id, columnIndex: colIdx, x: e.clientX, y: e.clientY });
                          }}
                        >
                          {widgets.map((w) => renderWidgetNode(w, `${sectionNode?.id ?? sidx}-${containerNode?.id ?? cidx}-${colNode?.id ?? colIdx}`))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {editor ? <DropZone index={globalWidgetIndex} /> : null}
    </div>
  );
}
