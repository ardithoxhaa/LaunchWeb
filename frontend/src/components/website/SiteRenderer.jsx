function NavbarBlock({ props, theme }) {
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
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdvancedNavbarBlock({ props, theme }) {
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
            <a key={l.href ?? l.label} href={l.href ?? '#'} className="hover:text-white">
              {l.label}
            </a>
          ))}
          {ctas.map((c, idx) => (
            <a
              key={idx}
              href={c.href ?? '#'}
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

function ProductGridBlock({ props, theme }) {
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
            href={props.cta.href ?? '#'}
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
                    href={p.cta.href ?? '#'}
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

function FeatureCarouselBlock({ props, theme }) {
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
            href={props.cta.href ?? '#'}
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
                  href={it.cta.href ?? '#'}
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

function FilterTabsBlock({ props, theme }) {
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
                  <a href={p.cta.href ?? '#'} className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15">
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

function MultiRowCarouselBlock({ props, theme }) {
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
                href={row.cta.href ?? '#'}
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
                href={it?.href ?? '#'}
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

function FooterLinksBlock({ props }) {
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
                  <a key={lidx} href={l?.href ?? '#'} className="block hover:text-white">
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

function StatsCtaBlock({ props, theme }) {
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
              href={props.primaryCta.href ?? '#'}
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

function RenderComponent({ component, theme, editorCtx }) {
  const type = component.type;
  const props = component.props;
  const styles = component.styles;

  switch (type) {
    case 'NAVBAR':
      return <NavbarBlock props={props} theme={theme} />;
    case 'ADVANCED_NAVBAR':
      return <AdvancedNavbarBlock props={props} theme={theme} />;
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
    case 'LOGO_CLOUD':
      return <LogoCloudBlock props={props} />;
    case 'PRICING':
      return <PricingBlock props={props} />;
    case 'TESTIMONIALS':
      return <TestimonialsBlock props={props} />;
    case 'FAQ':
      return <FaqBlock props={props} />;
    case 'STATS_CTA':
      return <StatsCtaBlock props={props} theme={theme} />;
    case 'PRODUCT_GRID':
      return <ProductGridBlock props={props} theme={theme} />;
    case 'FILTER_TABS':
      return <FilterTabsBlock props={props} theme={theme} />;
    case 'FEATURE_CAROUSEL':
      return <FeatureCarouselBlock props={props} theme={theme} />;
    case 'MULTI_ROW_CAROUSEL':
      return <MultiRowCarouselBlock props={props} theme={theme} />;
    case 'FOOTER_LINKS':
      return <FooterLinksBlock props={props} />;
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

export function SiteRenderer({ pages, activePageIndex = 0, theme, designSystem, editor }) {
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

  const rootStyle = {
    ...(designSystem?.typography?.fontFamily ? { fontFamily: designSystem.typography.fontFamily } : null),
    ...(designSystem?.typography?.baseFontSize ? { fontSize: `${designSystem.typography.baseFontSize}px` } : null),
    ...(designSystem?.typography?.lineHeight ? { lineHeight: String(designSystem.typography.lineHeight) } : null),
    ...(designSystem?.colors?.text ? { color: designSystem.colors.text } : null),
    ...((theme?.background ?? designSystem?.colors?.background)
      ? { backgroundColor: theme?.background ?? designSystem?.colors?.background }
      : null),
  };

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
              draggable={!!editor}
              onDragStart={() => editor?.onSetDragIndex?.(idx)}
              onDragOver={(e) => (editor ? e.preventDefault() : null)}
              onDrop={onDrop}
              onClick={() => editor?.onSelect?.(idx)}
              className={editor ? (selected ? 'outline outline-2 outline-indigo-400/60' : 'outline outline-1 outline-transparent') : ''}
            >
              <div style={computeComponentWrapperStyle(c)}>
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
