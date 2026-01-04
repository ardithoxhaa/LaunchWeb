/**
 * Widget Component
 * Renders individual widgets with editing capabilities
 */

import { useCallback, useRef, useState } from 'react';
import { useBuilder } from '../store/builderStore.jsx';
import { getWidget } from '../widgets/widgetRegistry';
import { WidgetRenderer } from './WidgetRenderer';

export function Widget({ widget, section, column, index, isSelected }) {
  const { state, actions } = useBuilder();
  const { drag, viewport } = state;
  const widgetRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const widgetDef = getWidget(widget.widgetType);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    actions.selectWidget(section.id, column.id, widget.id);
  }, [actions, section.id, column.id, widget.id]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleDragStart = useCallback((e) => {
    e.stopPropagation();
    actions.startDrag({
      dragType: 'widget',
      dragId: widget.id,
      dragData: {
        widget,
        sectionId: section.id,
        columnId: column.id,
      },
    });
  }, [actions, widget, section.id, column.id]);

  const handleDragEnd = useCallback(() => {
    actions.endDrag();
  }, [actions]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    actions.deleteWidget(section.id, column.id, widget.id);
  }, [actions, section.id, column.id, widget.id]);

  const handleDuplicate = useCallback((e) => {
    e.stopPropagation();
    actions.duplicateWidget(section.id, column.id, widget.id);
  }, [actions, section.id, column.id, widget.id]);

  const handleContentUpdate = useCallback((updates) => {
    actions.updateWidget(section.id, column.id, widget.id, {
      content: { ...widget.content, ...updates },
    });
  }, [actions, section.id, column.id, widget.id, widget.content]);

  // Compute widget styles
  const widgetStyle = {
    ...widget.style,
    ...(viewport !== 'desktop' && widget.responsiveStyle?.[viewport] || {}),
  };

  const isDragging = drag.isDragging && drag.dragType === 'widget' && drag.dragId === widget.id;

  return (
    <div
      ref={widgetRef}
      className={`
        group/widget relative transition-all duration-150
        ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-1 ring-offset-transparent' : ''}
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Widget Toolbar */}
      {isSelected && (
        <div className="absolute -top-9 left-0 right-0 flex items-center justify-between z-10">
          {/* Widget Type Label */}
          <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500 rounded text-xs font-medium text-white">
            <span>{widgetDef?.icon || '▢'}</span>
            <span>{widgetDef?.name || widget.widgetType}</span>
          </div>

          {/* Widget Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDuplicate}
              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 text-xs transition-colors"
              title="Duplicate"
            >
              ⧉
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-7 h-7 rounded bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white text-xs transition-colors"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Drag Handle */}
      <div 
        className={`
          absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-8 
          flex items-center justify-center cursor-grab
          opacity-0 group-hover/widget:opacity-100 transition-opacity
          ${isSelected ? 'opacity-100' : ''}
        `}
      >
        <div className="flex flex-col gap-0.5">
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="w-1 h-1 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Widget Content */}
      <div 
        className="relative"
        style={{
          // Layout
          width: widgetStyle.width || undefined,
          maxWidth: widgetStyle.maxWidth || undefined,
          minHeight: widgetStyle.minHeight || undefined,
          overflow: widgetStyle.overflow || undefined,
          // Typography
          color: widgetStyle.color || undefined,
          fontSize: widgetStyle.fontSize || undefined,
          fontWeight: widgetStyle.fontWeight || undefined,
          textAlign: widgetStyle.textAlign || undefined,
          lineHeight: widgetStyle.lineHeight || undefined,
          letterSpacing: widgetStyle.letterSpacing || undefined,
          // Background
          backgroundColor: widgetStyle.backgroundColor || undefined,
          backgroundImage: widgetStyle.backgroundImage || undefined,
          backgroundSize: widgetStyle.backgroundSize || 'cover',
          backgroundPosition: widgetStyle.backgroundPosition || 'center',
          // Spacing
          paddingTop: widgetStyle.paddingTop || undefined,
          paddingRight: widgetStyle.paddingRight || undefined,
          paddingBottom: widgetStyle.paddingBottom || undefined,
          paddingLeft: widgetStyle.paddingLeft || undefined,
          marginTop: widgetStyle.marginTop || undefined,
          marginRight: widgetStyle.marginRight || undefined,
          marginBottom: widgetStyle.marginBottom || undefined,
          marginLeft: widgetStyle.marginLeft || undefined,
          // Border
          borderWidth: widgetStyle.borderWidth || undefined,
          borderColor: widgetStyle.borderColor || undefined,
          borderStyle: widgetStyle.borderStyle || (widgetStyle.borderWidth ? 'solid' : undefined),
          borderRadius: widgetStyle.borderRadius || undefined,
          // Effects
          boxShadow: widgetStyle.boxShadow || undefined,
          opacity: widgetStyle.opacity || undefined,
          transform: widgetStyle.transform || undefined,
        }}
      >
        <WidgetRenderer
          widget={{ ...widget, style: widgetStyle }}
          isEditing={isEditing}
          onContentUpdate={handleContentUpdate}
          onEditEnd={() => setIsEditing(false)}
        />
      </div>

      {/* Selection Border */}
      <div className={`
        absolute inset-0 pointer-events-none border-2 border-transparent transition-colors rounded
        ${isSelected ? 'border-emerald-500/30' : 'group-hover/widget:border-white/10'}
      `} />

      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 rounded text-[10px] text-white">
          Editing • Click outside to finish
        </div>
      )}
    </div>
  );
}
