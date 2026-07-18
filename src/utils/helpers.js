export function generateUniqueId(prefix = 'id') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 6)
  return `${prefix}-${timestamp}-${random}`
}

export function getDefaultLabel(type) {
  const defaults = {
    text: 'Text Input',
    email: 'Email Address',
    number: 'Number',
    checkbox: 'Checkbox',
    radio: 'Radio Group',
    select: 'Dropdown',
    file: 'File Upload'
  }
  return defaults[type] || 'Field'
}

export function generateFieldName(type, existingNames = []) {
  const base = {
    text: 'text_field',
    email: 'email',
    number: 'number',
    checkbox: 'checkbox',
    radio: 'radio',
    select: 'select',
    file: 'file'
  }
  let baseName = base[type] || 'field'
  let name = baseName
  let suffix = 1
  while (existingNames.includes(name)) {
    name = `${baseName}_${suffix}`
    suffix++
  }
  return name
}

export function createFieldObject(type, existingNames = []) {
  const fieldId = generateUniqueId('field')
  const base = {
    id: fieldId,
    type,
    label: getDefaultLabel(type),
    name: generateFieldName(type, existingNames),
    required: false,
    placeholder: '',
    validation: {}
  }

  switch (type) {
    case 'radio':
    case 'select':
      base.options = ['Option 1', 'Option 2']
      break
    case 'file':
      base.validation = { maxSize: 10, allowedTypes: ['*/*'] }
      break
    case 'number':
      base.validation = { min: '', max: '' }
      break
    case 'text':
    case 'email':
      base.validation = { minLength: '', maxLength: '', pattern: '', customError: '' }
      break
    default:
      break
  }

  return base
}

export function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return pattern.test(email)
}

export function validateField(field, value) {
  const errors = []

  if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push({
      field: field.id,
      message: `${field.label || field.name} is required`,
      type: 'required'
    })
    return errors
  }

  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return errors
  }

  switch (field.type) {
    case 'email':
      if (!isValidEmail(value)) {
        errors.push({ field: field.id, message: 'Please enter a valid email address', type: 'email' })
      }
      break
    case 'number': {
      const num = parseFloat(value)
      if (isNaN(num)) {
        errors.push({ field: field.id, message: 'Please enter a valid number', type: 'number' })
      } else {
        if (field.validation.min !== '' && field.validation.min !== null && num < parseFloat(field.validation.min)) {
          errors.push({ field: field.id, message: `Value must be at least ${field.validation.min}`, type: 'min' })
        }
        if (field.validation.max !== '' && field.validation.max !== null && num > parseFloat(field.validation.max)) {
          errors.push({ field: field.id, message: `Value must be at most ${field.validation.max}`, type: 'max' })
        }
      }
      break
    }
    case 'text': {
      const str = String(value)
      if (field.validation.minLength && str.length < parseInt(field.validation.minLength)) {
        errors.push({ field: field.id, message: `Minimum ${field.validation.minLength} characters required`, type: 'minLength' })
      }
      if (field.validation.maxLength && str.length > parseInt(field.validation.maxLength)) {
        errors.push({ field: field.id, message: `Maximum ${field.validation.maxLength} characters allowed`, type: 'maxLength' })
      }
      if (field.validation.pattern) {
        try {
          const regex = new RegExp(field.validation.pattern)
          if (!regex.test(str)) {
            errors.push({ field: field.id, message: field.validation.customError || 'Invalid format', type: 'pattern' })
          }
        } catch (e) {
          // Invalid regex, skip
        }
      }
      break
    }
    case 'file':
      if (value instanceof File) {
        const maxSize = field.validation.maxSize || 10
        if (value.size > maxSize * 1024 * 1024) {
          errors.push({ field: field.id, message: `File size exceeds ${maxSize}MB limit`, type: 'fileSize' })
        }
        const allowedTypes = field.validation.allowedTypes || ['*/*']
        if (!allowedTypes.includes('*/*') && !allowedTypes.includes(value.type)) {
          errors.push({ field: field.id, message: 'File type not allowed', type: 'fileType' })
        }
      }
      break
    default:
      break
  }

  return errors
}

export function validateForm(form) {
  const results = { isValid: true, errors: [], warnings: [] }

  if (form.fields.length === 0) {
    results.isValid = false
    results.errors.push({ type: 'empty', message: 'Form must have at least one field' })
    return results
  }

  if (form.fields.length > 50) {
    results.isValid = false
    results.errors.push({ type: 'limit', message: 'Maximum 50 fields per form' })
  }

  const fieldNames = new Set()
  for (const field of form.fields) {
    if (field.name && fieldNames.has(field.name)) {
      results.isValid = false
      results.errors.push({ type: 'duplicateName', message: `Duplicate field name: ${field.name}`, fieldId: field.id })
    } else if (field.name) {
      fieldNames.add(field.name)
    }

    if (field.type === 'radio' && field.options && field.options.length < 2) {
      results.isValid = false
      results.errors.push({ type: 'insufficientOptions', message: 'Radio must have at least 2 options', fieldId: field.id })
    }
    if (field.type === 'select' && field.options && field.options.length < 1) {
      results.isValid = false
      results.errors.push({ type: 'missingOptions', message: 'Select must have at least 1 option', fieldId: field.id })
    }
  }

  return results
}

export function validateFieldProperties(properties, fieldType) {
  const validated = {}
  const allowed = ['label', 'name', 'placeholder', 'required', 'validation', 'options']

  for (const [key, value] of Object.entries(properties)) {
    if (allowed.includes(key)) {
      if (key === 'name') {
        validated[key] = String(value).replace(/[^a-zA-Z0-9_]/g, '')
      } else if (key === 'label') {
        validated[key] = String(value).substring(0, 100)
      } else if (key === 'placeholder') {
        validated[key] = String(value).substring(0, 200)
      } else {
        validated[key] = value
      }
    }
  }

  return validated
}

export function isFieldNameUnique(name, fields, excludeFieldId = null) {
  return !fields.some(f => f.name === name && f.id !== excludeFieldId)
}
