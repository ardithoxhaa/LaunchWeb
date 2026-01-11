/**
 * Column Component
 * Represents a column within a section that contains widgets
 */

import { useCallback, useMemo, useRef } from 'react';
import { useBuilder } from '../store/builderStore.jsx';
import { Widget } from './Widget';
import { DropZone } from './DropZone';
import { createWidgetInstance } from '../widgets/widgetRegistry';
import { scopeCss } from '../utils/scopeCss.js';

export function Column({ column, section, index, isSelected }) {
  const { state, actions } = useBuilder();
  const { drag, viewport, selection } = state;
  const columnRef = useRef(null);
  const settings = column?.settings || {};

  const scopeSelector = `[data-builder-node="column-${column?.id}"]`;
  const scopedCustomCss = useMemo(() => {
    if (!settings.customCSS) return '';
    return scopeCss(settings.customCSS, scopeSelector, { rootId: settings.cssId, rootClasses: settings.cssClasses });
  }, [settings.customCSS, settings.cssId, settings.cssClasses, scopeSelector]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    actions.selectColumn(section.id, column.id);
  }, [actions, section.id, column.id]);

  const handleDrop = useCallback((widgetIndex) => {
    if (!drag.isDragging) return;

    if (drag.dragType === 'new-widget') {
      const widget = createWidgetInstance(drag.dragData.widgetType);
      if (widget) {
        actions.addWidget(section.id, column.id, widget, widgetIndex);
      }
    } else if (drag.dragType === 'widget') {
      actions.moveWidget(
        drag.dragData.sectionId,
        drag.dragData.columnId,
        drag.dragId,
        section.id,
        column.id,
        widgetIndex
      );
    }

    actions.endDrag();
  }, [drag, actions, section.id, column.id]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (drag.isDragging) {
      actions.updateDrag({
        dropTarget: `column-${column.id}`,
      });
    }
  }, [drag.isDragging, actions, column.id]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (drag.dropTarget === `column-${column.id}`) {
      actions.updateDrag({ dropTarget: null });
    }
  }, [drag.dropTarget, actions, column.id]);

  // Compute column styles
  const columnStyle = {
    ...column.style,
    ...(viewport !== 'desktop' && column.responsiveStyle?.[viewport] || {}),
  };

  const containerStyle = {
    flex: `0 0 ${column.width}%`,
    minWidth: 0,
    backgroundColor: columnStyle.backgroundColor || 'transparent',
    padding: columnStyle.padding || '16px',
    borderRadius: columnStyle.borderRadius || '0',
  };

  const isEmpty = column.widgets.length === 0;
  const isDropTarget = drag.isDragging && drag.dropTarget === `column-${column.id}`;

  const hiddenForViewport =
    (viewport === 'desktop' && settings.hideOnDesktop) ||
    (viewport === 'tablet' && settings.hideOnTablet) ||
    (viewport === 'mobile' && settings.hideOnMobile);

  if (hiddenForViewport) return null;

  return (
    <div
      ref={columnRef}
      id={settings.cssId ? settings.cssId : undefined}
      data-builder-node={`column-${column.id}`}
      className={`
        group/column relative transition-all duration-200
        ${settings.cssClasses ? settings.cssClasses : ''}
        ${isSelected ? 'ring-2 ring-cyan-500 ring-inset' : ''}
        ${isDropTarget ? 'bg-indigo-500/10 ring-2 ring-indigo-500/50 ring-dashed' : ''}
      `}
      style={containerStyle}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {scopedCustomCss ? <style dangerouslySetInnerHTML={{ __html: scopedCustomCss }} /> : null}
      {/* Column Label */}
      <div className={`
        absolute -top-6 left-1/2 -translate-x-1/2
        text-[10px] font-medium px-2 py-0.5 rounded
        opacity-0 group-hover/column:opacity-100 transition-opacity
        ${isSelected ? 'opacity-100 bg-cyan-500 text-white' : 'bg-white/10 text-white/60'}
      `}>
        Column {index + 1}
      </div>

      {/* Column Actions */}
      {isSelected && (
        <div className="absolute -top-8 right-0 flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              actions.deleteColumn(section.id, column.id);
            }}
            className="w-6 h-6 rounded bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white text-xs"
            title="Delete Column"
          >
            ✕
          </button>
        </div>
      )}

      {/* Empty Column State */}
      {isEmpty && !drag.isDragging && (
        <div 
          className="min-h-[120px] border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center"
          onClick={handleClick}
        >
          <div className="text-center text-white/30 text-sm">
            <div className="text-2xl mb-1">+</div>
            <div>Drop widget here</div>
          </div>
        </div>
      )}

      {/* Drop zone at top of column */}
      {drag.isDragging && column.widgets.length > 0 && (
        <DropZone
          index={0}
          onDrop={() => handleDrop(0)}
          isActive={drag.dropPosition === `${column.id}-0`}
          type="widget"
        />
      )}

      {/* Widgets */}
      {column.widgets.map((widget, widgetIndex) => (
        <div key={widget.id}>
          <Widget
            widget={widget}
            section={section}
            column={column}
            index={widgetIndex}
            isSelected={selection.id === widget.id}
          />
          
          {/* Drop zone after each widget */}
          {drag.isDragging && (
            <DropZone
              index={widgetIndex + 1}
              onDrop={() => handleDrop(widgetIndex + 1)}
              isActive={drag.dropPosition === `${column.id}-${widgetIndex + 1}`}
              type="widget"
            />
          )}
        </div>
      ))}

      {/* Empty drop zone when dragging into empty column */}
      {isEmpty && drag.isDragging && (
        <div
          className="min-h-[120px] border-2 border-dashed border-indigo-500/50 rounded-lg flex items-center justify-center bg-indigo-500/10"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(0)}
        >
          <div className="text-center text-indigo-400 text-sm">
            <div className="text-2xl mb-1">+</div>
            <div>Drop here</div>
          </div>
        </div>
      )}

      {/* Column Border (visual feedback) */}
      <div className={`
        absolute inset-0 pointer-events-none border border-transparent transition-colors rounded
        ${isSelected ? 'border-cyan-500/30' : 'group-hover/column:border-white/10'}
      `} />
    </div>
  );
}
