/**
 * Version History Component
 * Shows version history with rollback functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

export function VersionHistory({ websiteId, onRestore, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    async function loadVersions() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/websites/${websiteId}/versions`);
        setVersions(data.versions || []);
      } catch (err) {
        setError(err?.response?.data?.error?.message || 'Failed to load versions');
      } finally {
        setLoading(false);
      }
    }

    loadVersions();
  }, [websiteId]);

  const handleRestore = useCallback(async (versionId) => {
    if (!window.confirm('Restore this version? Your current changes will be saved as a new version first.')) {
      return;
    }

    try {
      setRestoring(versionId);
      setError(null);
      await api.post(`/websites/${websiteId}/versions/${versionId}/restore`);
      onRestore?.();
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to restore version');
    } finally {
      setRestoring(null);
    }
  }, [websiteId, onRestore]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2d] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Version History</h2>
            <p className="text-sm text-white/60">Restore previous versions of your website</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
              <div className="text-red-400">{error}</div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 text-sm text-white/60 hover:text-white"
              >
                Try again
              </button>
            </div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3 opacity-30">📋</div>
              <div className="text-white/60">No versions yet</div>
              <div className="text-sm text-white/40 mt-1">
                Versions are created automatically when you save changes
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Version {version.version_number}
                        </span>
                        {index === 0 && (
                          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-white/50">
                        {getRelativeTime(version.created_at)}
                      </div>
                      <div className="mt-1 text-xs text-white/40">
                        {formatDate(version.created_at)}
                      </div>
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        disabled={restoring === version.id}
                        onClick={() => handleRestore(version.id)}
                        className={`
                          rounded-lg px-3 py-1.5 text-xs font-medium transition-colors
                          ${restoring === version.id
                            ? 'bg-white/10 text-white/40 cursor-wait'
                            : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                          }
                        `}
                      >
                        {restoring === version.id ? (
                          <span className="flex items-center gap-1">
                            <span className="h-3 w-3 animate-spin rounded-full border border-indigo-400 border-t-transparent" />
                            Restoring...
                          </span>
                        ) : (
                          'Restore'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/40">
              {versions.length} version{versions.length !== 1 ? 's' : ''} saved
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
