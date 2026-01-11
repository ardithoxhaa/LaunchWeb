import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';

function makeAbsoluteAssetUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `http://localhost:5000${url}`;
}

export function AssetsPage() {
  const { id } = useParams();
  const websiteId = Number(id);

  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const assetsSorted = useMemo(() => {
    return [...(assets ?? [])].sort((a, b) => Number(b.id) - Number(a.id));
  }, [assets]);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const { data } = await api.get('/assets', { params: { websiteId } });
        if (!canceled) setAssets(data.assets ?? []);
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load assets');
      }
    }

    if (Number.isFinite(websiteId)) load();

    return () => {
      canceled = true;
    };
  }, [websiteId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Asset library</div>
          <div className="text-sm text-white/60">Website #{websiteId}</div>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15" to={`/builder/${websiteId}`}>
            Back to builder
          </Link>
          <label className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400 cursor-pointer">
            {uploading ? 'Uploading…' : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;

                try {
                  setUploading(true);
                  setError(null);
                  const fd = new FormData();
                  fd.append('file', file);
                  fd.append('websiteId', String(websiteId));
                  const { data } = await api.post('/assets/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
                  setAssets((prev) => [data.asset, ...(prev ?? [])]);
                } catch (err) {
                  setError(err?.response?.data?.error?.message ?? 'Failed to upload');
                } finally {
                  setUploading(false);
                }
              }}
            />
          </label>
        </div>
      </div>

      {error ? <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      {assetsSorted.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assetsSorted.map((a) => {
            const fullUrl = makeAbsoluteAssetUrl(a.url);
            return (
              <div key={a.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="aspect-[4/3] w-full bg-black/30">
                  <img src={fullUrl} alt={a.meta?.originalName ?? `Asset ${a.id}`} className="h-full w-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-sm font-semibold truncate">{a.meta?.originalName ?? 'Image'}</div>
                  <div className="text-xs text-white/50 break-all">{fullUrl}</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText?.(fullUrl)}
                      className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                    >
                      Copy URL
                    </button>
                    <Link
                      to={`/builder/${websiteId}`}
                      className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                    >
                      Use in builder
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          No assets yet. Upload an image to start building a reusable library.
        </div>
      )}
    </div>
  );
}
