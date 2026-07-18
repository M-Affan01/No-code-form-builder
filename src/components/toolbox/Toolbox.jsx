import React from 'react'
import { useDrag } from 'react-dnd'
import {
  Type, Mail, Hash, CheckSquare, CircleDot,
  ChevronDown, Paperclip
} from 'lucide-react'

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: Type, color: '#6366f1' },
  { type: 'email', label: 'Email', icon: Mail, color: '#06b6d4' },
  { type: 'number', label: 'Number', icon: Hash, color: '#8b5cf6' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: '#10b981' },
  { type: 'radio', label: 'Radio Group', icon: CircleDot, color: '#f59e0b' },
  { type: 'select', label: 'Dropdown', icon: ChevronDown, color: '#ec4899' },
  { type: 'file', label: 'File Upload', icon: Paperclip, color: '#ef4444' }
]

function DraggableFieldType({ field }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD_TYPE',
    item: { fieldType: field.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  const Icon = field.icon

  return (
    <div
      ref={drag}
      className={`toolbox-field ${isDragging ? 'dragging' : ''}`}
      style={{ '--field-color': field.color }}
    >
      <div className="toolbox-field-icon" style={{ background: `${field.color}20`, color: field.color }}>
        <Icon size={18} />
      </div>
      <span className="toolbox-field-label">{field.label}</span>
    </div>
  )
}

export default function Toolbox() {
  return (
    <div className="toolbox">
      <div className="toolbox-header">
        <h3>Form Elements</h3>
      </div>
      <div className="toolbox-fields">
        {FIELD_TYPES.map(field => (
          <DraggableFieldType key={field.type} field={field} />
        ))}
      </div>
      <div className="toolbox-footer">
        <div className="toolbox-badge">Drag & Drop</div>
      </div>
    </div>
  )
}
