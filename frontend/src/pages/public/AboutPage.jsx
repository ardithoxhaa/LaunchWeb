export function AboutPage() {
  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-7">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            About LaunchWeb
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            A website builder for small businesses that want to look established.
          </h2>
          <p className="mt-3 max-w-3xl text-white/75">
            LaunchWeb helps you generate, customize, and publish a professional website in minutes. Pick a flagship
            template, edit content and design, and use an advanced drag-and-drop builder — backed by production-grade
            authentication and a normalized MySQL database.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-xs font-medium uppercase tracking-wide text-white/60">Templates</div>
              <div className="mt-2 text-lg font-semibold">Flagship layouts</div>
              <div className="mt-1 text-sm text-white/70">Nike / Netflix / Amazon-inspired sections, fully editable.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-xs font-medium uppercase tracking-wide text-white/60">Editor</div>
              <div className="mt-2 text-lg font-semibold">Fast changes</div>
              <div className="mt-1 text-sm text-white/70">Edit copy, images, links, colors, and layout without code.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-xs font-medium uppercase tracking-wide text-white/60">Builder</div>
              <div className="mt-2 text-lg font-semibold">Drag & drop</div>
              <div className="mt-1 text-sm text-white/70">Reorder sections, duplicate, and preview responsive widths.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Our mission</div>
          <p className="mt-3 text-white/75">
            Small businesses deserve websites that feel premium — without hiring an agency or spending weeks on
            iteration. LaunchWeb is built to compress the path from idea to a live site.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">Speed</div>
              <div className="mt-1 text-sm text-white/70">Start from a complete template and customize in minutes.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">Control</div>
              <div className="mt-1 text-sm text-white/70">Everything is editable — sections, text, images, and styling.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">Ownership</div>
              <div className="mt-1 text-sm text-white/70">Your website structure is stored per account in MySQL.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">Reliability</div>
              <div className="mt-1 text-sm text-white/70">Publish/unpublish, preview, and version history built in.</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">How it works</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold">1) Choose a template</div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">Preview first</div>
              </div>
              <div className="mt-2 text-sm text-white/70">Pick a professional starting point tailored to your business.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">2) Customize everything</div>
              <div className="mt-2 text-sm text-white/70">Edit sections, content, and visuals. Upload assets and reuse them.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">3) Preview & publish</div>
              <div className="mt-2 text-sm text-white/70">Preview on desktop/tablet/mobile, then publish when ready.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-semibold">Security & architecture</div>
            <p className="mt-3 max-w-3xl text-white/75">
              LaunchWeb is built like a real product: JWT access + refresh tokens, role-based authorization, protected
              routes, and a clean relational schema. Website structure and settings are stored as JSON where it makes
              sense — while still keeping ownership and constraints enforceable.
            </p>
          </div>
          <div className="grid w-full gap-3 md:w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">JWT auth</div>
              <div className="mt-1 text-sm text-white/70">Access + refresh tokens with secure session handling.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">RBAC</div>
              <div className="mt-1 text-sm text-white/70">Admin / User roles with protected API routes.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">Structured storage</div>
              <div className="mt-1 text-sm text-white/70">Pages + components stored cleanly in MySQL with JSON props.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Ready to build your site?</div>
            <div className="mt-1 text-white/70">Browse templates, preview them, and launch your first draft today.</div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href="/templates"
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
            >
              Explore templates
            </a>
            <a
              href="/register"
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
            >
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
