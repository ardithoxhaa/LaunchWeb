/**
 * DropZone Component
 * Visual drop indicator for drag and drop operations
 */

import { useCallback } from 'react';
import { useBuilder } from '../store/builderStore.jsx';

export function DropZone({ index, onDrop, isActive, type = 'section', isEmpty }) {
  const { state, actions } = useBuilder();
  const { drag } = state;

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (drag.isDragging) {
      actions.updateDrag({
        dropTarget: `${type}-${index}`,
        dropPosition: index,
      });
    }
  }, [drag.isDragging, actions, type, index]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (drag.dropTarget === `${type}-${index}`) {
      actions.updateDrag({ dropTarget: null, dropPosition: null });
    }
  }, [drag.dropTarget, actions, type, index]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop();
  }, [onDrop]);

  if (!drag.isDragging) return null;

  const isHighlighted = isActive || drag.dropTarget === `${type}-${index}`;

  if (isEmpty) {
    return (
      <div
        className={`
          min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center transition-all
          ${isHighlighted 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-white/20 bg-white/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`text-center ${isHighlighted ? 'text-indigo-400' : 'text-white/40'}`}>
          <div className="text-4xl mb-2">+</div>
          <div className="text-sm font-medium">Drop here to add</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative transition-all duration-200
        ${type === 'widget' ? 'h-2 my-1' : 'h-4 my-2'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`
        absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all
        ${isHighlighted 
          ? 'bg-indigo-500 scale-y-100 opacity-100' 
          : 'bg-white/20 scale-y-50 opacity-0'
        }
      `} />
      
      {isHighlighted && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
          +
        </div>
      )}
    </div>
  );
}
