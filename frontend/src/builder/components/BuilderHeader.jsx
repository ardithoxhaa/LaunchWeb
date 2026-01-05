/**
 * Builder Header Component
 * Top toolbar with save, preview, undo/redo, and responsive controls
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBuilder } from '../store/builderStore.jsx';
import { VersionHistory } from './VersionHistory';
import { SeoEditor } from './SeoEditor';

export function BuilderHeader({ websiteId, websiteName, websiteSeo, onSave, onPreview, onVersionRestore, onSeoUpdate }) {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showSeoEditor, setShowSeoEditor] = useState(false);
  const { state, actions } = useBuilder();
  const { viewport, history, saving } = state;

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <header className="h-14 bg-[#1e1e2d] border-b border-white/10 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Back Button */}
        <Link
          to={`/dashboard`}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span>←</span>
          <span className="text-sm">Back</span>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Website Name */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{websiteName || 'Untitled Website'}</span>
          {saving.hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-amber-500" title="Unsaved changes" />
          )}
        </div>
      </div>

      {/* Center Section - Responsive Controls */}
      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
        <ViewportButton
          active={viewport === 'desktop'}
          onClick={() => actions.setViewport('desktop')}
          icon="🖥"
          label="Desktop"
        />
        <ViewportButton
          active={viewport === 'tablet'}
          onClick={() => actions.setViewport('tablet')}
          icon="📱"
          label="Tablet"
        />
        <ViewportButton
          active={viewport === 'mobile'}
          onClick={() => actions.setViewport('mobile')}
          icon="📲"
          label="Mobile"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 mr-2">
          <button
            type="button"
            onClick={() => actions.undo()}
            disabled={!canUndo}
            className="w-8 h-8 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => actions.redo()}
            disabled={!canRedo}
            className="w-8 h-8 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>

        {/* Preview Button */}
        <button
          type="button"
          onClick={onPreview}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>👁</span>
          <span>Preview</span>
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          disabled={saving.isSaving}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
            ${saving.hasUnsavedChanges 
              ? 'bg-indigo-500 hover:bg-indigo-400' 
              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }
            ${saving.isSaving ? 'opacity-70 cursor-wait' : ''}
          `}
        >
          {saving.isSaving ? (
            <>
              <span className="animate-spin">⟳</span>
              <span>Saving...</span>
            </>
          ) : saving.hasUnsavedChanges ? (
            <>
              <span>💾</span>
              <span>Save</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Saved</span>
            </>
          )}
        </button>

        {/* SEO Button */}
        <button
          type="button"
          onClick={() => setShowSeoEditor(true)}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors flex items-center gap-2"
          title="SEO Settings"
        >
          <span>🔍</span>
          <span className="hidden lg:inline">SEO</span>
        </button>

        {/* Version History Button */}
        <button
          type="button"
          onClick={() => setShowVersionHistory(true)}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors flex items-center gap-2"
          title="Version History"
        >
          <span>📋</span>
          <span className="hidden lg:inline">History</span>
        </button>

        {/* More Options */}
        <button
          type="button"
          className="w-8 h-8 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="More options"
        >
          ⋮
        </button>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistory
          websiteId={websiteId}
          onRestore={() => {
            setShowVersionHistory(false);
            onVersionRestore?.();
          }}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      {/* SEO Editor Modal */}
      {showSeoEditor && (
        <SeoEditor
          websiteId={websiteId}
          initialSeo={websiteSeo}
          onSave={() => {}}
          onClose={() => setShowSeoEditor(false)}
          onSeoUpdate={onSeoUpdate}
        />
      )}
    </header>
  );
}

function ViewportButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5
        ${active 
          ? 'bg-indigo-500/30 text-indigo-400' 
          : 'text-white/60 hover:text-white hover:bg-white/10'
        }
      `}
      title={label}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
