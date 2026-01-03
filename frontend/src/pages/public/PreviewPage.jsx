import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';

export function PreviewPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const activePath = useMemo(() => {
    const prefix = `/preview/${slug}`;
    const rest = slug && location.pathname.startsWith(prefix) ? location.pathname.slice(prefix.length) : location.pathname;
    const p = rest && rest.length ? rest : '/';
    return p === '' ? '/' : p;
  }, [location.pathname, slug]);

  const activePageIndex = useMemo(() => {
    const pages = data?.pages ?? [];
    const idx = pages.findIndex((p) => String(p?.path) === String(activePath));
    return idx >= 0 ? idx : 0;
  }, [activePath, data?.pages]);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const { data: payload } = await api.get(`/public/websites/${slug}/structure`);
        if (!canceled) setData(payload);
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Preview not available');
      }
    }

    if (slug) load();

    return () => {
      canceled = true;
    };
  }, [slug]);

  if (error) {
    return <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div>;
  }

  if (!data) {
    return <div className="text-sm text-white/60">Loading preview…</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <SiteRenderer
        pages={data.pages}
        activePageIndex={activePageIndex}
        theme={data.website?.settings?.theme}
        designSystem={data.website?.settings?.designSystem}
        linkBasePath={`/preview/${slug}`}
      />
    </div>
  );
}
