import { Link } from 'react-router-dom';

export function HomePage() {
  const logos = ['Apex Fitness', 'Cedar Cafe', 'Northwind Studio', 'Nimbus SaaS', 'Harbor Dental'];
  const features = [
    {
      title: 'Template → Real website in minutes',
      text: 'Start from a full multi-page template (Home / About / Contact) and customize everything without shared data.',
    },
    {
      title: 'Advanced builder components',
      text: 'Reusable sections like navbars, hero blocks, feature grids, galleries, forms, and footers — all editable.',
    },
    {
      title: 'Version history & restore',
      text: 'Every structural change creates a snapshot so you can roll back safely when iterating on design.',
    },
    {
      title: 'Publish / unpublish + preview',
      text: 'Instant preview mode and controlled publishing. Keep drafts private and ship when ready.',
    },
    {
      title: 'Per-website SEO settings',
      text: 'Manage titles, descriptions, and metadata so your site is ready for real customers and search engines.',
    },
    {
      title: 'Multi-business management',
      text: 'Operate multiple brands under one account: each business can have multiple websites and versions.',
    },
  ];

  const templateHighlights = [
    {
      name: 'Apex Fitness',
      category: 'Fitness',
      bullets: ['Hero + CTA', 'Feature grid', 'About page', 'Contact form'],
    },
    {
      name: 'Cedar Cafe',
      category: 'Restaurant',
      bullets: ['Menu sections', 'Gallery', 'Location & hours', 'Reservations CTA'],
    },
    {
      name: 'Nimbus SaaS',
      category: 'Software',
      bullets: ['Pricing', 'Integrations', 'Testimonials', 'FAQ'],
    },
  ];

  const steps = [
    {
      title: 'Pick a template',
      text: 'Choose a professional template built for real businesses. Templates are cloned per user (no shared content).',
    },
    {
      title: 'Customize sections',
      text: 'Edit content, styles, layout, buttons, and images — from a simple editor to an advanced drag-and-drop builder.',
    },
    {
      title: 'Preview & publish',
      text: 'Preview the live experience, then publish. Your public site is served from saved structure in MySQL.',
    },
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '€19',
      note: 'For a single business website',
      items: ['1 business', '1 published website', 'Templates + editor', 'Preview mode'],
      cta: 'Start Starter',
      emphasis: false,
    },
    {
      name: 'Pro',
      price: '€49',
      note: 'For growing businesses',
      items: ['3 businesses', 'Unlimited drafts', 'Version history', 'Advanced builder components'],
      cta: 'Go Pro',
      emphasis: true,
    },
    {
      name: 'Agency',
      price: '€99',
      note: 'For teams and agencies',
      items: ['10 businesses', 'Client handoff workflow', 'Asset library', 'Priority support'],
      cta: 'Contact sales',
      emphasis: false,
    },
  ];

  const testimonials = [
    {
      name: 'Maya K.',
      role: 'Owner, Apex Fitness',
      quote:
        'We went from “no website” to a site that looks like a real brand. The template gave us a pro baseline, and the builder let us customize everything.',
    },
    {
      name: 'Jonas R.',
      role: 'Founder, Nimbus SaaS',
      quote:
        'Version history is a lifesaver. We experiment fast, restore when needed, and publish only when we’re confident.',
    },
    {
      name: 'Leila S.',
      role: 'Manager, Cedar Cafe',
      quote:
        'The preview mode makes it simple to review changes with the team. Publishing feels controlled and professional.',
    },
  ];

  const faqs = [
    {
      q: 'Are templates shared between users?',
      a: 'No. A template is cloned into your website structure (pages + components) so your content is private and fully editable.',
    },
    {
      q: 'Where is my website saved?',
      a: 'In MySQL as a normalized structure: websites, pages, components, plus settings/SEO JSON. Version snapshots are stored separately.',
    },
    {
      q: 'Can I unpublish a website?',
      a: 'Yes. You can switch between DRAFT and PUBLISHED anytime. Public preview only works for published websites.',
    },
    {
      q: 'Is this just a demo?',
      a: 'No. LaunchWeb is built with production patterns: JWT access + refresh tokens, RBAC, validation, and a clean schema.',
    },
  ];

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-500/15 via-transparent to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_55%)]" />
        <div className="relative grid gap-10 p-8 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Website builder for real businesses
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Launch a professional website in minutes — not weeks.
            </h1>
            <p className="mt-4 max-w-xl text-white/75">
              LaunchWeb combines production-grade templates, a fast editor, and an advanced component builder. Your
              website is saved per-user, versioned, and ready to publish.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition"
              >
                Create account
              </Link>
              <Link
                to="/templates"
                className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition"
              >
                Browse templates
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium hover:bg-black/30 transition"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xl font-semibold">8–10</div>
                <div className="mt-1 text-xs text-white/60">full templates</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xl font-semibold">Drag & drop</div>
                <div className="mt-1 text-xs text-white/60">builder components</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xl font-semibold">Versioned</div>
                <div className="mt-1 text-xs text-white/60">safe iteration</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Live Builder</div>
                <div className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">Preview</div>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">NAVBAR</div>
                  <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">HERO</div>
                  <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-white/10" />
                  <div className="mt-3 inline-flex rounded-md bg-indigo-500/70 px-3 py-1.5 text-xs font-medium">
                    Edit CTA
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">FEATURE GRID</div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="h-14 rounded-lg bg-white/5" />
                    <div className="h-14 rounded-lg bg-white/5" />
                    <div className="h-14 rounded-lg bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold">Trusted by modern small businesses</div>
            <div className="mt-1 text-sm text-white/60">Design-forward templates built for real-world pages.</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {logos.map((l) => (
              <div
                key={l}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need to ship a real website</h2>
          <p className="mt-2 max-w-2xl text-white/70">
            LaunchWeb is built like a real product: authentication, roles, protected routes, normalized data model, and
            editable website structures stored in MySQL.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-black/30"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
              </div>
              <div className="mt-3 text-sm text-white/70">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Templates that feel like real brands</h2>
          <p className="mt-2 text-white/70">
            Not basic landing pages. Each template includes multiple pages and business-specific sections you can edit.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/templates"
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition"
            >
              Explore templates
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition"
            >
              Build your site
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {templateHighlights.map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60">{t.category}</div>
                  <div className="mt-1 text-lg font-semibold">{t.name}</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/30 via-white/10 to-transparent" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/70">
                {t.bullets.map((b) => (
                  <div key={b} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-2 text-white/70">A streamlined flow that still gives you full control.</p>
          </div>
          <div className="md:col-span-2 grid gap-4">
            {steps.map((s, idx) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-sm font-semibold text-indigo-200">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{s.title}</div>
                    <div className="mt-2 text-sm text-white/70">{s.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {pricing.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-6 ${
              p.emphasis
                ? 'border-indigo-400/40 bg-indigo-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-2 flex items-end gap-1">
                  <div className="text-3xl font-semibold">{p.price}</div>
                  <div className="pb-1 text-sm text-white/60">/mo</div>
                </div>
                <div className="mt-1 text-sm text-white/60">{p.note}</div>
              </div>
              {p.emphasis ? (
                <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200">Most popular</div>
              ) : null}
            </div>
            <div className="mt-5 space-y-2">
              {p.items.map((it) => (
                <div key={it} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/75">
                  {it}
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${
                p.emphasis ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Built for real outcomes</h2>
          <p className="mt-2 text-white/70">A builder that feels professional, fast, and safe to iterate on.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-white/75">“{t.quote}”</div>
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="mt-1 text-xs text-white/60">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
          <p className="mt-2 text-white/70">Quick answers to common questions.</p>
        </div>
        <div className="grid gap-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-white/10 bg-white/5 p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold">
                <div className="flex items-center justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/60 group-open:hidden">
                    Open
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/60 hidden group-open:inline">
                    Close
                  </span>
                </div>
              </summary>
              <div className="mt-3 text-sm text-white/70">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/20 via-white/5 to-transparent p-8">
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Ready to build your first website?</h2>
            <p className="mt-2 text-white/70">
              Create an account, pick a template, customize it, preview it, and publish — all backed by a real database.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition"
            >
              Get started
            </Link>
            <Link
              to="/templates"
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition"
            >
              See templates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
