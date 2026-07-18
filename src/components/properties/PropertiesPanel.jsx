import React, { useState, useEffect, useCallback } from 'react'
import { useFormBuilder } from '../../context/FormBuilderContext'
import {
  Settings, Tag, AtSign, AlignLeft, ToggleLeft,
  AlertCircle, Plus, X, Info, AlertTriangle, List
} from 'lucide-react'
import {
  validateFieldName, validateLabel, validatePlaceholder,
  validateOptions, LABEL_MAX_LENGTH, PLACEHOLDER_MAX_LENGTH, FIELD_NAME_MAX_LENGTH
} from '../../utils/validation'

export default function PropertiesPanel() {
  const { state, dispatch } = useFormBuilder()
  const selectedField = state.fields.find(f => f.id === state.selectedFieldId)

  if (!selectedField) {
    return (
      <div className="properties-panel">
        <div className="properties-header">
          <div className="properties-header-left">
            <Settings size={14} />
            <h3>Properties</h3>
          </div>
        </div>
        <div className="properties-empty">
          <Settings size={40} strokeWidth={1} />
          <p>Select a field on the canvas to edit its properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <div className="properties-header-left">
          <Settings size={14} />
          <h3>Properties</h3>
        </div>
        <span className="properties-field-type">{selectedField.type}</span>
      </div>
      <div className="properties-content">
        <FieldProperties field={selectedField} dispatch={dispatch} allFields={state.fields} />
        {(selectedField.type === 'radio' || selectedField.type === 'select') && (
          <OptionsEditor field={selectedField} dispatch={dispatch} />
        )}
        <ValidationEditor field={selectedField} dispatch={dispatch} />
      </div>
    </div>
  )
}

function FieldProperties({ field, dispatch, allFields }) {
  const [label, setLabel] = useState(field.label)
  const [name, setName] = useState(field.name)
  const [placeholder, setPlaceholder] = useState(field.placeholder || '')
  const [required, setRequired] = useState(field.required || false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    setLabel(field.label)
    setName(field.name)
    setPlaceholder(field.placeholder || '')
    setRequired(field.required || false)
    setErrors({})
    setTouched({})
  }, [field.id])

  const validateField = useCallback((key, value) => {
    const newErrors = { ...errors }
    delete newErrors[key]

    if (key === 'label') {
      const result = validateLabel(value)
      if (!result.valid) newErrors[key] = result.errors[0].message
    }
    if (key === 'name') {
      const otherNames = allFields.filter(f => f.id !== field.id).map(f => f.name).filter(Boolean)
      const result = validateFieldName(value, otherNames)
      if (!result.valid) newErrors[key] = result.errors[0].message
    }
    if (key === 'placeholder') {
      const result = validatePlaceholder(value)
      if (!result.valid) newErrors[key] = result.errors[0].message
    }

    setErrors(newErrors)
    return newErrors
  }, [errors, allFields, field.id])

  const update = (key, value) => {
    const errs = validateField(key, value)
    if (!errs[key]) {
      dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: field.id, properties: { [key]: value } } })
    }
  }

  return (
    <div className="property-group">
      <div className="property-group-title">
        <Tag size={12} /><span>General</span>
      </div>

      <div className={`property-field ${errors.label ? 'has-error' : ''}`}>
        <label><AlignLeft size={12} />Label<span className="property-hint">{label.length}/{LABEL_MAX_LENGTH}</span></label>
        <input type="text" value={label}
          onChange={(e) => { setLabel(e.target.value); if (touched.label) update('label', e.target.value) }}
          onBlur={() => { setTouched(t => ({ ...t, label: true })); update('label', label) }}
          maxLength={LABEL_MAX_LENGTH} className={errors.label ? 'input-error' : ''} />
        {errors.label && <div className="property-error"><AlertTriangle size={11} />{errors.label}</div>}
      </div>

      <div className={`property-field ${errors.name ? 'has-error' : ''}`}>
        <label><AtSign size={12} />Name<span className="property-hint">{name.length}/{FIELD_NAME_MAX_LENGTH}</span></label>
        <input type="text" value={name}
          onChange={(e) => { const v = e.target.value.replace(/[^a-zA-Z0-9_]/g, ''); setName(v); if (touched.name) update('name', v) }}
          onBlur={() => { setTouched(t => ({ ...t, name: true })); update('name', name) }}
          maxLength={FIELD_NAME_MAX_LENGTH} className={errors.name ? 'input-error' : ''} />
        {errors.name && <div className="property-error"><AlertTriangle size={11} />{errors.name}</div>}
      </div>

      {field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'file' && (
        <div className={`property-field ${errors.placeholder ? 'has-error' : ''}`}>
          <label><AlertCircle size={12} />Placeholder<span className="property-hint">{placeholder.length}/{PLACEHOLDER_MAX_LENGTH}</span></label>
          <input type="text" value={placeholder}
            onChange={(e) => { setPlaceholder(e.target.value); if (touched.placeholder) update('placeholder', e.target.value) }}
            onBlur={() => { setTouched(t => ({ ...t, placeholder: true })); update('placeholder', placeholder) }}
            maxLength={PLACEHOLDER_MAX_LENGTH} className={errors.placeholder ? 'input-error' : ''} />
          {errors.placeholder && <div className="property-error"><AlertTriangle size={11} />{errors.placeholder}</div>}
        </div>
      )}

      <div className="property-toggle">
        <label onClick={(e) => { e.preventDefault(); const v = !required; setRequired(v); dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: field.id, properties: { required: v } } }) }}>
          <ToggleLeft size={16} /><span>Required field</span>
          <div className={`toggle-switch ${required ? 'active' : ''}`}><div className="toggle-knob" /></div>
        </label>
      </div>
    </div>
  )
}

function OptionsEditor({ field, dispatch }) {
  const [options, setOptions] = useState(field.options || [])
  const [optionErrors, setOptionErrors] = useState([])

  useEffect(() => {
    setOptions(field.options || [])
    setOptionErrors([])
  }, [field.id, field.options])

  const updateOptions = (newOptions) => {
    setOptions(newOptions)
    const result = validateOptions(newOptions, field.type)
    setOptionErrors(result.valid ? [] : result.errors.map(e => e.message))
    if (newOptions.every(o => o.trim() !== '')) {
      dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: field.id, properties: { options: newOptions } } })
    }
  }

  const minReq = field.type === 'radio' ? 2 : 1

  return (
    <div className="property-group">
      <div className="property-group-title">
        <List size={12} /><span>Options</span><span className="property-hint">{options.length}/50</span>
      </div>
      {optionErrors.length > 0 && optionErrors.map((err, i) => (
        <div key={i} className="property-error"><AlertTriangle size={11} />{err}</div>
      ))}
      <div className="options-list">
        {options.map((opt, i) => (
          <div key={i} className={`option-item ${opt.trim() === '' ? 'option-empty' : ''}`}>
            <span className="option-number">{i + 1}</span>
            <input type="text" value={opt} onChange={(e) => updateOptions([...options.slice(0, i), e.target.value, ...options.slice(i + 1)])} className="option-input" placeholder={`Option ${i + 1}`} />
            <button className="option-remove" onClick={() => updateOptions(options.filter((_, j) => j !== i))} disabled={options.length <= minReq}><X size={14} /></button>
          </div>
        ))}
      </div>
      <button className="option-add" onClick={() => options.length < 50 && updateOptions([...options, `Option ${options.length + 1}`])}>
        <Plus size={14} />Add Option
      </button>
    </div>
  )
}

function ValidationEditor({ field, dispatch }) {
  const [validation, setValidation] = useState(field.validation || {})
  const [valErrors, setValErrors] = useState([])

  useEffect(() => {
    setValidation(field.validation || {})
    setValErrors([])
  }, [field.id, field.validation])

  const updateValidation = (key, value) => {
    const newV = { ...validation, [key]: value }
    setValidation(newV)

    const errors = []
    if (field.type === 'number') {
      if (newV.min !== '' && newV.min !== null && newV.min !== undefined && isNaN(parseFloat(newV.min))) {
        errors.push('Min must be a valid number')
      }
      if (newV.max !== '' && newV.max !== null && newV.max !== undefined && isNaN(parseFloat(newV.max))) {
        errors.push('Max must be a valid number')
      }
      if (!isNaN(parseFloat(newV.min)) && !isNaN(parseFloat(newV.max)) && parseFloat(newV.min) > parseFloat(newV.max)) {
        errors.push('Min cannot be greater than Max')
      }
    }
    if (field.type === 'text' && newV.pattern) {
      try { new RegExp(newV.pattern) } catch (e) { errors.push('Invalid regex pattern') }
    }
    setValErrors(errors)

    if (errors.length === 0) {
      dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: field.id, properties: { validation: newV } } })
    }
  }

  return (
    <div className="property-group">
      <div className="property-group-title">
        <AlertCircle size={12} /><span>Validation</span>
      </div>
      {valErrors.length > 0 && valErrors.map((err, i) => (
        <div key={i} className="property-error"><AlertTriangle size={11} />{err}</div>
      ))}
      {field.type === 'text' && (<>
        <div className="property-field"><label>Min Length</label><input type="number" value={validation.minLength || ''} onChange={(e) => updateValidation('minLength', e.target.value)} min="0" /></div>
        <div className="property-field"><label>Max Length</label><input type="number" value={validation.maxLength || ''} onChange={(e) => updateValidation('maxLength', e.target.value)} min="0" /></div>
        <div className="property-field"><label>Pattern<span className="property-hint">Regex</span></label><input type="text" value={validation.pattern || ''} onChange={(e) => updateValidation('pattern', e.target.value)} placeholder="e.g. ^[A-Za-z]+$" /></div>
        <div className="property-field"><label>Custom Error</label><input type="text" value={validation.customError || ''} onChange={(e) => updateValidation('customError', e.target.value)} /></div>
      </>)}
      {field.type === 'number' && (<>
        <div className="property-field"><label>Min Value</label><input type="number" value={validation.min || ''} onChange={(e) => updateValidation('min', e.target.value)} /></div>
        <div className="property-field"><label>Max Value</label><input type="number" value={validation.max || ''} onChange={(e) => updateValidation('max', e.target.value)} /></div>
      </>)}
      {field.type === 'file' && (<>
        <div className="property-field"><label>Max Size (MB)</label><input type="number" value={validation.maxSize || 10} onChange={(e) => updateValidation('maxSize', parseInt(e.target.value) || 10)} min="1" max="50" /></div>
        <div className="property-field"><label>Allowed Types</label>
          <select multiple value={validation.allowedTypes || ['*/*']} onChange={(e) => updateValidation('allowedTypes', Array.from(e.target.selectedOptions, o => o.value))} className="property-select-multi">
            <option value="*/*">All Types</option>
            <option value="image/*">Images</option>
            <option value="application/pdf">PDF</option>
            <option value="application/msword">Word</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
      </>)}
      {field.type === 'email' && (
        <div className="property-info"><Info size={14} /><span>Email format validation is auto-enabled</span></div>
      )}
    </div>
  )
}
