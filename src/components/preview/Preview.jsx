import React, { useState, useEffect, useMemo } from 'react'
import { useFormBuilder } from '../../context/FormBuilderContext'
import { validateFieldValue, validateForSubmission } from '../../utils/validation'
import { Eye, X, Send, RotateCcw, CheckCircle, FileText, AlertTriangle } from 'lucide-react'

export default function Preview() {
  const { state, dispatch, addToast } = useFormBuilder()
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitData, setSubmitData] = useState(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    setFormData({})
    setErrors({})
    setSubmitted(false)
    setSubmitData(null)
    setSubmitAttempted(false)
  }, [state.fields])

  const totalErrors = useMemo(() => Object.keys(errors).length, [errors])

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))

    const field = state.fields.find(f => (f.name || f.id) === fieldName)
    if (field) {
      const fieldErrors = validateFieldValue(field, value)
      setErrors(prev => {
        const n = { ...prev }
        if (fieldErrors.length > 0) n[fieldName] = fieldErrors[0].message
        else delete n[fieldName]
        return n
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitAttempted(true)
    setSubmitted(true)

    const result = validateForSubmission(
      { fields: state.fields },
      formData
    )

    if (!result.valid) {
      const allErrors = {}
      result.errors.forEach(err => {
        if (err.field) allErrors[err.field] = err.message
      })
      setErrors(allErrors)
      addToast(`Validation failed: ${result.errors.length} error(s)`, 'error')
      return
    }

    dispatch({ type: 'ADD_SUBMISSION', payload: formData })
    setSubmitData({ ...formData })
    setFormData({})
    setErrors({})
    setSubmitAttempted(false)
    addToast('Form submitted successfully!', 'success')
    setTimeout(() => setSubmitData(null), 8000)
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
    setSubmitted(false)
    setSubmitAttempted(false)
    setSubmitData(null)
  }

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <div className="preview-header-left">
          <Eye size={14} />
          <h3>Live Preview</h3>
          {totalErrors > 0 && (
            <span className="preview-error-badge">
              <AlertTriangle size={10} /> {totalErrors} error{totalErrors > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button className="preview-close" onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: false })}>
          <X size={14} /> Close
        </button>
      </div>

      <div className="preview-content">
        {state.fields.length === 0 ? (
          <div className="preview-empty">
            <FileText size={48} strokeWidth={1} />
            <h3>No Fields Yet</h3>
            <p>Add fields in Build mode to see a live preview</p>
          </div>
        ) : (
          <div className="preview-wrapper">
            <form className="preview-form" onSubmit={handleSubmit} onReset={handleReset} noValidate>
              <div className="preview-form-header">
                <h2 className="preview-form-title">{state.formTitle}</h2>
                {state.formDescription && <p className="preview-form-description">{state.formDescription}</p>}
              </div>
              <div className="preview-form-body">
                {state.fields.map(field => (
                  <PreviewField
                    key={field.id} field={field}
                    value={formData[field.name || field.id]}
                    error={errors[field.name || field.id]}
                    onChange={handleFieldChange}
                    submitted={submitAttempted}
                  />
                ))}
              </div>
              <div className="preview-form-footer">
                <button type="submit" className="preview-submit-btn"><Send size={14} />Submit Form</button>
                <button type="reset" className="preview-reset-btn"><RotateCcw size={14} />Reset</button>
              </div>
            </form>
            {submitData && (
              <div className="preview-success">
                <div className="preview-success-icon"><CheckCircle size={32} /></div>
                <h4>Submission Successful!</h4>
                <p>Your form data has been captured</p>
                <pre className="preview-submit-data">{JSON.stringify(submitData, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PreviewField({ field, value, error, onChange, submitted }) {
  const fieldName = field.name || field.id
  const showError = submitted && error

  switch (field.type) {
    case 'text': case 'email': case 'number':
      return (
        <div className={`preview-field ${showError ? 'has-error' : ''}`}>
          <label className="preview-label">{field.label}{field.required && <span className="required">*</span>}</label>
          <input type={field.type} className={`preview-input ${showError ? 'input-error' : ''}`}
            placeholder={field.placeholder} value={value || ''}
            onChange={(e) => onChange(fieldName, e.target.value)} />
          {showError && <span className="preview-error"><AlertTriangle size={11} />{error}</span>}
        </div>
      )
    case 'checkbox':
      return (
        <div className={`preview-field ${showError ? 'has-error' : ''}`}>
          <label className="preview-checkbox-label">
            <input type="checkbox" checked={value || false} onChange={(e) => onChange(fieldName, e.target.checked)} />
            <span className="checkbox-visual" />
            <span>{field.label}{field.required && <span className="required">*</span>}</span>
          </label>
          {showError && <span className="preview-error"><AlertTriangle size={11} />{error}</span>}
        </div>
      )
    case 'radio':
      return (
        <div className={`preview-field ${showError ? 'has-error' : ''}`}>
          <label className="preview-label">{field.label}{field.required && <span className="required">*</span>}</label>
          <div className="preview-radio-group">
            {(field.options || []).map((opt, i) => (
              <label key={i} className="preview-radio-option">
                <input type="radio" name={fieldName} value={opt} checked={value === opt} onChange={(e) => onChange(fieldName, e.target.value)} />
                <span className="radio-visual" /><span>{opt}</span>
              </label>
            ))}
          </div>
          {showError && <span className="preview-error"><AlertTriangle size={11} />{error}</span>}
        </div>
      )
    case 'select':
      return (
        <div className={`preview-field ${showError ? 'has-error' : ''}`}>
          <label className="preview-label">{field.label}{field.required && <span className="required">*</span>}</label>
          <select className={`preview-select ${showError ? 'input-error' : ''}`} value={value || ''} onChange={(e) => onChange(fieldName, e.target.value)}>
            <option value="">Select...</option>
            {(field.options || []).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
          {showError && <span className="preview-error"><AlertTriangle size={11} />{error}</span>}
        </div>
      )
    case 'file':
      return (
        <div className={`preview-field ${showError ? 'has-error' : ''}`}>
          <label className="preview-label">{field.label}{field.required && <span className="required">*</span>}</label>
          <input type="file" className={`preview-file ${showError ? 'input-error' : ''}`} onChange={(e) => onChange(fieldName, e.target.files?.[0] || null)} />
          <span className="preview-file-hint">Max size: {field.validation?.maxSize || 10}MB</span>
          {showError && <span className="preview-error"><AlertTriangle size={11} />{error}</span>}
        </div>
      )
    default: return null
  }
}
