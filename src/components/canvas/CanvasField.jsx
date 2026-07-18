import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import {
  GripVertical, Trash2, ChevronUp, ChevronDown,
  Type, Mail, Hash, CheckSquare, CircleDot, ChevronDown as ChevronDownIcon, Paperclip
} from 'lucide-react'

const FIELD_ICONS = {
  text: Type,
  email: Mail,
  number: Hash,
  checkbox: CheckSquare,
  radio: CircleDot,
  select: ChevronDownIcon,
  file: Paperclip
}

const FIELD_COLORS = {
  text: '#6366f1',
  email: '#06b6d4',
  number: '#8b5cf6',
  checkbox: '#10b981',
  radio: '#f59e0b',
  select: '#ec4899',
  file: '#ef4444'
}

export default function CanvasField({ field, index, isSelected, onSelect, onDelete, moveField, totalFields }) {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_FIELD',
    item: () => ({ id: field.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ handlerId }, drop] = useDrop({
    accept: 'CANVAS_FIELD',
    hover(item, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveField(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId()
    })
  })

  drag(drop(ref))

  const Icon = FIELD_ICONS[field.type] || Type
  const color = FIELD_COLORS[field.type] || '#6366f1'

  const getFieldPreview = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div className="canvas-field-input-wrap">
            <input
              type="text"
              className="canvas-field-input"
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
              disabled
            />
          </div>
        )
      case 'number':
        return (
          <div className="canvas-field-input-wrap">
            <input
              type="text"
              className="canvas-field-input"
              placeholder={field.placeholder || '0'}
              disabled
            />
          </div>
        )
      case 'checkbox':
        return (
          <div className="canvas-field-checkbox">
            <div className="checkbox-custom" />
            <span>{field.label}</span>
          </div>
        )
      case 'radio':
        return (
          <div className="canvas-field-options">
            {(field.options || []).map((opt, i) => (
              <label key={i} className="canvas-field-option">
                <div className="radio-custom" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )
      case 'select':
        return (
          <div className="canvas-field-select-wrap">
            <select className="canvas-field-select" disabled>
              <option>Select...</option>
              {(field.options || []).map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          </div>
        )
      case 'file':
        return (
          <div className="canvas-field-file">
            <Paperclip size={16} />
            <span>Click or drag to upload</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={ref}
      className={`canvas-field ${isSelected ? 'canvas-field-selected' : ''} ${isDragging ? 'canvas-field-dragging' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      data-handler-id={handlerId}
      style={{ '--field-color': color }}
    >
      <div className="canvas-field-header">
        <div className="canvas-field-header-left">
          <GripVertical size={14} className="canvas-field-grip" />
          <div className="canvas-field-badge" style={{ background: `${color}20`, color }}>
            <Icon size={12} />
            <span>{field.type}</span>
          </div>
        </div>
        <div className="canvas-field-actions">
          {index > 0 && (
            <button
              className="canvas-field-btn"
              onClick={(e) => { e.stopPropagation(); moveField(index, index - 1) }}
              title="Move up"
            >
              <ChevronUp size={14} />
            </button>
          )}
          {index < totalFields - 1 && (
            <button
              className="canvas-field-btn"
              onClick={(e) => { e.stopPropagation(); moveField(index, index + 1) }}
              title="Move down"
            >
              <ChevronDown size={14} />
            </button>
          )}
          <button
            className="canvas-field-btn canvas-field-btn-delete"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            title="Delete field"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {field.type !== 'checkbox' && (
        <label className="canvas-field-label">
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
      )}
      {getFieldPreview()}
    </div>
  )
}
