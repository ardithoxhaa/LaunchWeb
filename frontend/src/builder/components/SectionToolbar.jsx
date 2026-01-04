/**
 * Section Toolbar Component
 * Floating toolbar for section actions
 */

import { useCallback } from 'react';
import { useBuilder } from '../store/builderStore.jsx';

export function SectionToolbar({ section, isVisible, onAddColumn }) {
  const { actions } = useBuilder();

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    actions.deleteSection(section.id);
  }, [actions, section.id]);

  const handleDuplicate = useCallback((e) => {
    e.stopPropagation();
    actions.duplicateSection(section.id);
  }, [actions, section.id]);

  const handleMoveUp = useCallback((e) => {
    e.stopPropagation();
    // Find current index and move up
    // This will be handled by the parent
  }, []);

  const handleMoveDown = useCallback((e) => {
    e.stopPropagation();
    // Find current index and move down
    // This will be handled by the parent
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-indigo-600 rounded-lg px-2 py-1.5 shadow-lg z-20">
      {/* Section Label */}
      <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-white/90 border-r border-white/20 mr-1">
        <span className="text-white/60">⊞</span>
        <span>Section</span>
      </div>

      {/* Add Column */}
      <ToolbarButton
        icon="+"
        title="Add Column"
        onClick={(e) => {
          e.stopPropagation();
          onAddColumn();
        }}
      />

      {/* Edit Section */}
      <ToolbarButton
        icon="⚙"
        title="Edit Section"
        onClick={(e) => {
          e.stopPropagation();
          actions.setRightPanelTab('style');
        }}
      />

      {/* Duplicate */}
      <ToolbarButton
        icon="⧉"
        title="Duplicate Section"
        onClick={handleDuplicate}
      />

      {/* Delete */}
      <ToolbarButton
        icon="✕"
        title="Delete Section"
        onClick={handleDelete}
        danger
      />
    </div>
  );
}

function ToolbarButton({ icon, title, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        w-7 h-7 rounded flex items-center justify-center text-sm transition-colors
        ${danger 
          ? 'text-red-300 hover:bg-red-500/30 hover:text-red-200' 
          : 'text-white/80 hover:bg-white/20 hover:text-white'
        }
      `}
    >
      {icon}
    </button>
  );
}
