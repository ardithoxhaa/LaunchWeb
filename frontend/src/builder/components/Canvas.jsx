/**
 * Canvas Component
 * The main editing area where sections, columns, and widgets are rendered
 * Full-width layout with proper spacing like Elementor
 */

import { useCallback, useRef } from 'react';
import { useBuilder } from '../store/builderStore.jsx';
import { Section } from './Section';
import { DropZone } from './DropZone';
import { createWidgetInstance } from '../widgets/widgetRegistry';

export function Canvas() {
  const { state, actions } = useBuilder();
  const { document, viewport, drag, selection } = state;
  const canvasRef = useRef(null);

  // Viewport widths for responsive preview
  const viewportStyles = {
    desktop: { width: '100%', maxWidth: '100%' },
    tablet: { width: '768px', maxWidth: '768px', margin: '0 auto' },
    mobile: { width: '375px', maxWidth: '375px', margin: '0 auto' },
  };

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current || e.target.dataset.canvasBackground) {
      actions.clearSelection();
    }
  }, [actions]);

  const handleDrop = useCallback((index) => {
    if (!drag.isDragging) return;

    if (drag.dragType === 'new-widget') {
      // Create a new section with the widget
      const widget = createWidgetInstance(drag.dragData.widgetType);
      if (widget) {
        actions.addSection({
          columns: [{
            widgets: [widget],
          }],
        }, index);
      }
    } else if (drag.dragType === 'section') {
      actions.moveSection(drag.dragId, index);
    }

    actions.endDrag();
  }, [drag, actions]);

  const isEmpty = document.sections.length === 0;

  return (
    <div 
      className="flex-1 overflow-auto bg-[#0f0f1a]"
      onClick={handleCanvasClick}
      data-canvas-background
    >
      {/* Canvas wrapper - simulates the actual page */}
      <div 
        ref={canvasRef}
        className="min-h-full bg-[#0a0a12] transition-all duration-300 ease-out"
        style={{
          ...viewportStyles[viewport],
        }}
      >
        {/* Empty state */}
        {isEmpty && !drag.isDragging && (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/20 rounded-2xl bg-white/5">
            <div className="text-6xl mb-4 opacity-30">+</div>
            <div className="text-lg font-semibold text-white/60 mb-2">Start Building</div>
            <div className="text-sm text-white/40 mb-6 text-center max-w-md">
              Drag widgets from the left panel or click below to add your first section
            </div>
            <button
              type="button"
              onClick={() => actions.addSection({})}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium transition-colors"
            >
              Add Section
            </button>
          </div>
        )}

        {/* Drop zone at top */}
        {drag.isDragging && document.sections.length > 0 && (
          <DropZone 
            index={0} 
            onDrop={() => handleDrop(0)}
            isActive={drag.dropTarget === 'section-0'}
          />
        )}

        {/* Sections */}
        {document.sections.map((section, index) => (
          <div key={section.id}>
            <Section
              section={section}
              index={index}
              isSelected={selection.type === 'section' && selection.id === section.id}
            />
            
            {/* Drop zone after each section */}
            {drag.isDragging && (
              <DropZone 
                index={index + 1} 
                onDrop={() => handleDrop(index + 1)}
                isActive={drag.dropTarget === `section-${index + 1}`}
              />
            )}
          </div>
        ))}

        {/* Empty drop zone when dragging */}
        {isEmpty && drag.isDragging && (
          <DropZone 
            index={0} 
            onDrop={() => handleDrop(0)}
            isActive={true}
            isEmpty
          />
        )}
      </div>
    </div>
  );
}
