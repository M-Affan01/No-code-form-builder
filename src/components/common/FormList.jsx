import React, { useState } from 'react'
import { useFormBuilder } from '../../context/FormBuilderContext'
import { getAllSavedForms, deleteFormFromStorage } from '../../utils/storage'
import { FolderOpen, Plus, FileText, Trash2 } from 'lucide-react'

export default function FormList({ onClose }) {
  const { state, loadForm, createNewForm, addToast } = useFormBuilder()
  const [newTitle, setNewTitle] = useState('')
  const formsList = getAllSavedForms()

  const handleCreate = () => {
    const title = newTitle.trim() || 'Untitled Form'
    createNewForm(title)
    setNewTitle('')
    addToast(`"${title}" created`, 'success')
    onClose()
  }

  const handleLoad = (formId) => {
    if (loadForm(formId)) {
      addToast('Form loaded', 'success')
      onClose()
    } else {
      addToast('Failed to load', 'error')
    }
  }

  const handleDelete = (e, formId) => {
    e.stopPropagation()
    if (window.confirm('Delete this form?')) {
      deleteFormFromStorage(formId)
      addToast('Form deleted', 'info')
    }
  }

  return (
    <div className="formlist-overlay" onClick={onClose}>
      <div className="formlist-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="formlist-header">
          <h3>Your Forms</h3>
          <button className="formlist-close" onClick={onClose}>×</button>
        </div>
        <div className="formlist-create">
          <input
            type="text" value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New form name..." className="formlist-input"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button className="formlist-create-btn" onClick={handleCreate}>
            <Plus size={14} /> Create
          </button>
        </div>
        <div className="formlist-list">
          {formsList.length === 0 ? (
            <div className="formlist-empty">
              <FolderOpen size={32} strokeWidth={1} />
              <p>No saved forms yet</p>
            </div>
          ) : (
            formsList.map(form => (
              <div
                key={form.id}
                className={`formlist-item ${form.id === state.currentFormId ? 'active' : ''}`}
                onClick={() => handleLoad(form.id)}
              >
                <div className="formlist-item-icon"><FileText size={18} /></div>
                <div className="formlist-item-info">
                  <h4>{form.title}</h4>
                  <p>{form.fieldCount} fields · {form.submissionCount} submissions</p>
                </div>
                <button className="formlist-item-delete" onClick={(e) => handleDelete(e, form.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
