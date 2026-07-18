import React, { useState, useMemo } from 'react'
import { useFormBuilder } from '../../context/FormBuilderContext'
import { deleteFormFromStorage } from '../../utils/storage'
import { validateFormSchema } from '../../utils/validation'
import {
  Layers, Save, Plus, FolderOpen, Eye, Code,
  FileText, Pencil, X, Trash2, Calendar, Hash, AlertTriangle
} from 'lucide-react'

export default function Header() {
  const { state, dispatch, saveCurrentForm, addToast } = useFormBuilder()
  const [showFormList, setShowFormList] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)

  const handleSave = () => {
    const validation = validateFormSchema({ id: state.currentFormId, title: state.formTitle, fields: state.fields })
    if (!validation.valid) {
      addToast(`Cannot save: ${validation.errors[0].message}`, 'error')
      return
    }
    const result = saveCurrentForm()
    if (result.success) {
      addToast('Form saved successfully', 'success')
    } else {
      addToast(result.error?.message || 'Failed to save form', 'error')
    }
  }

  const handleNewForm = () => {
    if (state.isDirty && !window.confirm('Unsaved changes will be lost. Continue?')) return
    dispatch({ type: 'CREATE_FORM', payload: { title: 'Untitled Form' } })
    addToast('New form created', 'info')
  }

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div className="header-logo">
            <div className="header-logo-icon">
              <Layers size={20} />
            </div>
            <span className="logo-text">No-code Form Builder</span>
          </div>
          <div className="header-divider" />
          <div className="header-form-name">
            {editingTitle ? (
              <input
                type="text"
                value={state.formTitle}
                onChange={(e) => dispatch({ type: 'SET_FORM_TITLE', payload: e.target.value })}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="header-title-input"
                autoFocus
                maxLength={100}
              />
            ) : (
              <span
                className="header-title"
                onClick={() => setEditingTitle(true)}
                title="Click to edit"
              >
                <Pencil size={12} />
                {state.formTitle}
              </span>
            )}
            {state.isDirty && <span className="unsaved-indicator" />}
          </div>
        </div>

        <div className="header-center">
          <button
            className={`header-btn ${!state.isPreviewMode && !state.showSubmissions ? 'active' : ''}`}
            onClick={() => {
              dispatch({ type: 'SET_PREVIEW_MODE', payload: false })
              dispatch({ type: 'SHOW_SUBMISSIONS', payload: false })
            }}
          >
            <Code size={14} />
            Build
          </button>
          <button
            className={`header-btn ${state.isPreviewMode ? 'active' : ''}`}
            onClick={() => {
              dispatch({ type: 'SHOW_SUBMISSIONS', payload: false })
              dispatch({ type: 'SET_PREVIEW_MODE', payload: true })
            }}
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            className={`header-btn ${state.showSubmissions ? 'active' : ''}`}
            onClick={() => {
              dispatch({ type: 'SET_PREVIEW_MODE', payload: false })
              dispatch({ type: 'SHOW_SUBMISSIONS', payload: true })
            }}
          >
            <FileText size={14} />
            Submissions
            {state.submissions.length > 0 && (
              <span className="header-badge">{state.submissions.length}</span>
            )}
          </button>
        </div>

        <div className="header-right">
          <button className="header-btn header-btn-ghost" onClick={handleNewForm}>
            <Plus size={14} />
            New
          </button>
          <button className="header-btn header-btn-ghost" onClick={() => setShowFormList(true)}>
            <FolderOpen size={14} />
            My Forms
          </button>
          <button className="header-btn header-btn-ghost" onClick={handleSave} disabled={!state.currentFormId}>
            <Save size={14} />
            Save
          </button>
          <button
            className="header-btn header-btn-accent"
            onClick={() => dispatch({ type: 'SHOW_EXPORT', payload: { show: true } })}
            disabled={state.fields.length === 0}
          >
            <Code size={14} />
            Export
          </button>
        </div>
      </header>

      {showFormList && <FormListDialog onClose={() => setShowFormList(false)} />}
    </>
  )
}

function FormListDialog({ onClose }) {
  const { state, loadForm, createNewForm, addToast } = useFormBuilder()
  const [newTitle, setNewTitle] = useState('')

  const savedForms = useMemo(() => {
    try {
      return Object.keys(localStorage)
        .filter(k => k.startsWith('formbuilder_form_'))
        .map(k => {
          const formId = k.replace('formbuilder_form_', '')
          const data = JSON.parse(localStorage.getItem(k))
          return {
            id: formId,
            title: data.title || 'Untitled Form',
            fieldCount: (data.fields || []).length,
            submissionCount: (data.submissions || []).length,
            updatedAt: data.updatedAt
          }
        })
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    } catch { return [] }
  }, [state.currentFormId])

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
      onClose()
    }
  }

  return (
    <div className="formlist-overlay" onClick={onClose}>
      <div className="formlist-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="formlist-header">
          <h3>My Forms</h3>
          <button className="formlist-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="formlist-create">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New form name..."
            className="formlist-input"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button className="formlist-create-btn" onClick={handleCreate}>
            <Plus size={14} /> Create
          </button>
        </div>

        <div className="formlist-list">
          {savedForms.length === 0 ? (
            <div className="formlist-empty">
              <FolderOpen size={32} strokeWidth={1} />
              <p>No saved forms yet</p>
            </div>
          ) : (
            savedForms.map(form => (
              <div
                key={form.id}
                className={`formlist-item ${form.id === state.currentFormId ? 'active' : ''}`}
                onClick={() => handleLoad(form.id)}
              >
                <div className="formlist-item-icon">
                  <FileText size={20} />
                </div>
                <div className="formlist-item-info">
                  <h4>{form.title}</h4>
                  <div className="formlist-item-meta">
                    <span><Hash size={10} /> {form.fieldCount} fields</span>
                    <span><FileText size={10} /> {form.submissionCount} subs</span>
                    {form.updatedAt && (
                      <span><Calendar size={10} /> {new Date(form.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
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
