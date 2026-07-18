import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { useFormBuilder } from '../../context/FormBuilderContext'
import CanvasField from './CanvasField'
import { Inbox } from 'lucide-react'

export default function Canvas() {
  const { state, dispatch } = useFormBuilder()
  const canvasRef = useRef(null)

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'FIELD_TYPE',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      let position = state.fields.length

      if (canvasRect && offset) {
        const fieldElements = canvasRef.current.querySelectorAll('.canvas-field')
        for (let i = 0; i < fieldElements.length; i++) {
          const rect = fieldElements[i].getBoundingClientRect()
          if (offset.y < rect.top + rect.height / 2) {
            position = i
            break
          }
        }
      }

      dispatch({
        type: 'ADD_FIELD',
        payload: { fieldType: item.fieldType, position }
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }), [state.fields.length, dispatch])

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.closest('.canvas-empty')) {
      dispatch({ type: 'SELECT_FIELD', payload: null })
    }
  }

  const moveField = (dragIndex, hoverIndex) => {
    const dragField = state.fields[dragIndex]
    dispatch({
      type: 'REORDER_FIELDS',
      payload: { fieldId: dragField.id, newIndex: hoverIndex }
    })
  }

  drop(canvasRef)

  return (
    <div className="canvas-wrapper">
      <div className="canvas-header">
        <div className="canvas-header-left">
          <h3>Form Canvas</h3>
          <span className="field-count">{state.fields.length} field{state.fields.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div
        ref={canvasRef}
        className={`canvas ${isOver ? 'canvas-over' : ''} ${canDrop ? 'canvas-can-drop' : ''}`}
        onClick={handleCanvasClick}
      >
        {state.fields.length === 0 ? (
          <div className="canvas-empty">
            <div className="canvas-empty-icon">
              <Inbox size={48} strokeWidth={1.5} />
            </div>
            <h3>Start Building Your Form</h3>
            <p>Drag fields from the sidebar and drop them here</p>
          </div>
        ) : (
          state.fields.map((field, index) => (
            <CanvasField
              key={field.id}
              field={field}
              index={index}
              totalFields={state.fields.length}
              isSelected={state.selectedFieldId === field.id}
              onSelect={() => dispatch({ type: 'SELECT_FIELD', payload: field.id })}
              onDelete={() => dispatch({ type: 'DELETE_FIELD', payload: field.id })}
              moveField={moveField}
            />
          ))
        )}
      </div>
    </div>
  )
}
