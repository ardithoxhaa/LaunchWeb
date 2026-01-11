/**
 * Section Component
 * Represents a section in the page hierarchy (Section → Column → Widget)
 */

import { useCallback, useMemo, useRef } from 'react';
import { useBuilder } from '../store/builderStore.jsx';
import { Column } from './Column';
import { SectionToolbar } from './SectionToolbar';
import { scopeCss } from '../utils/scopeCss.js';

export function Section({ section, index, isSelected }) {
  const { state, actions } = useBuilder();
  const { drag, viewport } = state;
  const sectionRef = useRef(null);
  const settings = section?.settings || {};

  const scopeSelector = `[data-builder-node="section-${section?.id}"]`;
  const scopedCustomCss = useMemo(() => {
    if (!settings.customCSS) return '';
    return scopeCss(settings.customCSS, scopeSelector, { rootId: settings.cssId, rootClasses: settings.cssClasses });
  }, [settings.customCSS, settings.cssId, settings.cssClasses, scopeSelector]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    actions.selectSection(section.id);
  }, [actions, section.id]);

  const handleDragStart = useCallback((e) => {
    e.stopPropagation();
    actions.startDrag({
      dragType: 'section',
      dragId: section.id,
      dragData: section,
    });
  }, [actions, section]);

  const handleAddColumn = useCallback(() => {
    actions.addColumn(section.id, {});
  }, [actions, section.id]);

  // Compute section styles
  const sectionStyle = {
    ...section.style,
    ...(viewport !== 'desktop' && section.responsiveStyle?.[viewport] || {}),
  };

  const containerStyle = {
    backgroundColor: sectionStyle.backgroundColor || 'transparent',
    backgroundImage: sectionStyle.backgroundImage ? `url(${sectionStyle.backgroundImage})` : undefined,
    backgroundSize: sectionStyle.backgroundSize || 'cover',
    backgroundPosition: sectionStyle.backgroundPosition || 'center',
    paddingTop: sectionStyle.paddingTop || '60px',
    paddingBottom: sectionStyle.paddingBottom || '60px',
    paddingLeft: sectionStyle.paddingLeft || '0',
    paddingRight: sectionStyle.paddingRight || '0',
    marginTop: sectionStyle.marginTop || '0',
    marginBottom: sectionStyle.marginBottom || '0',
    width: '100%',
  };

  const innerStyle = {
    maxWidth: sectionStyle.contentWidth || '1200px',
    margin: '0 auto',
    paddingLeft: '32px',
    paddingRight: '32px',
    width: '100%',
  };

  const hiddenForViewport =
    (viewport === 'desktop' && settings.hideOnDesktop) ||
    (viewport === 'tablet' && settings.hideOnTablet) ||
    (viewport === 'mobile' && settings.hideOnMobile);

  if (hiddenForViewport) return null;

  return (
    <div
      ref={sectionRef}
      id={settings.cssId ? settings.cssId : undefined}
      data-builder-node={`section-${section.id}`}
      className={`
        group relative transition-all duration-200
        ${settings.cssClasses ? settings.cssClasses : ''}
        ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#1a1a2e]' : ''}
        ${drag.isDragging && drag.dragType === 'section' && drag.dragId === section.id ? 'opacity-50' : ''}
      `}
      style={containerStyle}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
    >
      {scopedCustomCss ? <style dangerouslySetInnerHTML={{ __html: scopedCustomCss }} /> : null}
      {/* Section Toolbar */}
      <SectionToolbar
        section={section}
        isVisible={isSelected}
        onAddColumn={handleAddColumn}
      />

      {/* Section Handle (drag indicator) */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 transition-opacity
        ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}
      `} />

      {/* Section Label */}
      <div className={`
        absolute -left-8 top-1/2 -translate-y-1/2 
        text-xs font-medium text-white/40 writing-mode-vertical
        opacity-0 group-hover:opacity-100 transition-opacity
        ${isSelected ? 'opacity-100 text-indigo-400' : ''}
      `}>
        Section
      </div>

      {/* Columns Container */}
      <div style={innerStyle}>
        <div className="flex gap-4" style={{ minHeight: '100px' }}>
          {section.columns.map((column, colIndex) => (
            <Column
              key={column.id}
              column={column}
              section={section}
              index={colIndex}
              isSelected={state.selection.columnId === column.id}
            />
          ))}
        </div>
      </div>

      {/* Add Column Button (visible when section is selected) */}
      {isSelected && section.columns.length < 6 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddColumn();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center text-white text-lg transition-colors"
          title="Add Column"
        >
          +
        </button>
      )}

      {/* Section Border Overlay (for visual feedback) */}
      <div className={`
        absolute inset-0 pointer-events-none border-2 border-transparent transition-colors
        ${isSelected ? 'border-indigo-500/30' : 'group-hover:border-white/10'}
      `} />
    </div>
  );
}
