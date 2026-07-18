// ===== FIELD NAME VALIDATION =====
export const FIELD_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/
export const FIELD_NAME_MAX_LENGTH = 50
export const LABEL_MAX_LENGTH = 100
export const PLACEHOLDER_MAX_LENGTH = 200
export const FORM_TITLE_MAX_LENGTH = 100
export const FORM_DESC_MAX_LENGTH = 500
export const MAX_FIELDS_PER_FORM = 50
export const MAX_FILE_SIZE_MB = 50
export const MIN_FILE_SIZE_MB = 1
export const MAX_OPTIONS = 50
export const MIN_RADIO_OPTIONS = 2
export const MIN_SELECT_OPTIONS = 1
export const MAX_SUBMISSIONS = 10000

// ===== VALIDATION ERROR TYPES =====
export const ERROR_TYPES = {
  REQUIRED: 'required',
  DUPLICATE_NAME: 'duplicateName',
  INVALID_NAME: 'invalidName',
  NAME_STARTS_WITH_NUMBER: 'nameStartsWithNumber',
  NAME_TOO_LONG: 'nameTooLong',
  LABEL_EMPTY: 'labelEmpty',
  LABEL_TOO_LONG: 'labelTooLong',
  PLACEHOLDER_TOO_LONG: 'placeholderTooLong',
  INVALID_EMAIL: 'invalidEmail',
  INVALID_NUMBER: 'invalidNumber',
  NUMBER_TOO_LOW: 'numberTooLow',
  NUMBER_TOO_HIGH: 'numberTooHigh',
  TEXT_TOO_SHORT: 'textTooShort',
  TEXT_TOO_LONG: 'textTooLong',
  INVALID_PATTERN: 'invalidPattern',
  INVALID_REGEX: 'invalidRegex',
  FILE_TOO_LARGE: 'fileTooLarge',
  FILE_TYPENotAllowed: 'fileTypeNotAllowed',
  INSUFFICIENT_OPTIONS: 'insufficientOptions',
  MISSING_OPTIONS: 'missingOptions',
  TOO_MANY_OPTIONS: 'tooManyOptions',
  OPTION_EMPTY: 'optionEmpty',
  DUPLICATE_OPTIONS: 'duplicateOptions',
  MAX_FIELDS: 'maxFields',
  EMPTY_FORM: 'emptyForm',
  INVALID_FORM_ID: 'invalidFormId',
  STORAGE_FULL: 'storageFull',
  STORAGE_UNAVAILABLE: 'storageUnavailable',
  INVALID_JSON: 'invalidJson',
  EXPORT_FAILED: 'exportFailed',
  VALIDATION_FAILED: 'validationFailed',
  MAX_SIZE_EXCEEDED: 'maxSizeExceeded',
  MIN_INVALID: 'minInvalid',
  MAX_INVALID: 'maxInvalid',
  MIN_GREATER_THAN_MAX: 'minGreaterThanMax'
}

// ===== ERROR MESSAGES (USER FRIENDLY) =====
export const ERROR_MESSAGES = {
  [ERROR_TYPES.REQUIRED]: 'This field is required',
  [ERROR_TYPES.DUPLICATE_NAME]: (name) => `Field name "${name}" already exists. Use a unique name`,
  [ERROR_TYPES.INVALID_NAME]: 'Name must contain only letters, numbers, and underscores',
  [ERROR_TYPES.NAME_STARTS_WITH_NUMBER]: 'Name must start with a letter or underscore',
  [ERROR_TYPES.NAME_TOO_LONG]: `Name must be ${FIELD_NAME_MAX_LENGTH} characters or less`,
  [ERROR_TYPES.LABEL_EMPTY]: 'Label cannot be empty',
  [ERROR_TYPES.LABEL_TOO_LONG]: `Label must be ${LABEL_MAX_LENGTH} characters or less`,
  [ERROR_TYPES.PLACEHOLDER_TOO_LONG]: `Placeholder must be ${PLACEHOLDER_MAX_LENGTH} characters or less`,
  [ERROR_TYPES.INVALID_EMAIL]: 'Please enter a valid email address',
  [ERROR_TYPES.INVALID_NUMBER]: 'Please enter a valid number',
  [ERROR_TYPES.NUMBER_TOO_LOW]: (min) => `Value must be at least ${min}`,
  [ERROR_TYPES.NUMBER_TOO_HIGH]: (max) => `Value must be at most ${max}`,
  [ERROR_TYPES.TEXT_TOO_SHORT]: (min) => `Minimum ${min} characters required`,
  [ERROR_TYPES.TEXT_TOO_LONG]: (max) => `Maximum ${max} characters allowed`,
  [ERROR_TYPES.INVALID_PATTERN]: 'Value does not match the required pattern',
  [ERROR_TYPES.INVALID_REGEX]: 'Invalid regular expression pattern',
  [ERROR_TYPES.FILE_TOO_LARGE]: (max) => `File size exceeds ${max}MB limit`,
  [ERROR_TYPES.FILE_TYPENotAllowed]: 'This file type is not allowed',
  [ERROR_TYPES.INSUFFICIENT_OPTIONS]: `Radio groups need at least ${MIN_RADIO_OPTIONS} options`,
  [ERROR_TYPES.MISSING_OPTIONS]: `Dropdown needs at least ${MIN_SELECT_OPTIONS} option`,
  [ERROR_TYPES.TOO_MANY_OPTIONS]: `Maximum ${MAX_OPTIONS} options allowed`,
  [ERROR_TYPES.OPTION_EMPTY]: 'Options cannot be empty',
  [ERROR_TYPES.DUPLICATE_OPTIONS]: 'Duplicate options found',
  [ERROR_TYPES.MAX_FIELDS]: `Maximum ${MAX_FIELDS_PER_FORM} fields per form`,
  [ERROR_TYPES.EMPTY_FORM]: 'Form must have at least one field',
  [ERROR_TYPES.INVALID_FORM_ID]: 'Invalid form ID format',
  [ERROR_TYPES.STORAGE_FULL]: 'Storage is full. Please delete some forms to free space',
  [ERROR_TYPES.STORAGE_UNAVAILABLE]: 'Browser storage is not available',
  [ERROR_TYPES.INVALID_JSON]: 'Invalid JSON format',
  [ERROR_TYPES.EXPORT_FAILED]: 'Failed to generate export. Please try again',
  [ERROR_TYPES.VALIDATION_FAILED]: 'Please fix the errors before proceeding',
  [ERROR_TYPES.MAX_SIZE_EXCEEDED]: 'Storage quota exceeded',
  [ERROR_TYPES.MIN_INVALID]: 'Minimum value must be a valid number',
  [ERROR_TYPES.MAX_INVALID]: 'Maximum value must be a valid number',
  [ERROR_TYPES.MIN_GREATER_THAN_MAX]: 'Minimum value cannot be greater than maximum'
}

// ===== VALIDATION RESULT BUILDER =====
function createError(type, field = null, message = null, extra = {}) {
  const msg = message || (typeof ERROR_MESSAGES[type] === 'function'
    ? ERROR_MESSAGES[type](extra.param)
    : ERROR_MESSAGES[type])
  return { type, field, message: msg, ...extra, valid: false }
}

function createSuccess() {
  return { valid: true, errors: [] }
}

function createFailure(errors) {
  return { valid: false, errors }
}

// ===== FIELD NAME VALIDATION =====
export function validateFieldName(name, existingNames = [], excludeFieldId = null) {
  const errors = []

  if (!name || name.trim() === '') {
    errors.push(createError(ERROR_TYPES.REQUIRED, null, 'Field name is required'))
    return createFailure(errors)
  }

  if (name.length > FIELD_NAME_MAX_LENGTH) {
    errors.push(createError(ERROR_TYPES.NAME_TOO_LONG))
  }

  if (!FIELD_NAME_REGEX.test(name)) {
    if (/^[0-9]/.test(name)) {
      errors.push(createError(ERROR_TYPES.NAME_STARTS_WITH_NUMBER))
    } else {
      errors.push(createError(ERROR_TYPES.INVALID_NAME))
    }
  }

  const isDuplicate = existingNames.some(
    (n, i) => n === name && existingNames.indexOf(n) !== i
  ) || (!excludeFieldId && existingNames.includes(name))

  if (isDuplicate) {
    errors.push(createError(ERROR_TYPES.DUPLICATE_NAME, null, null, { param: name }))
  }

  return errors.length > 0 ? createFailure(errors) : createSuccess()
}

// ===== FIELD LABEL VALIDATION =====
export function validateLabel(label) {
  const errors = []

  if (!label || label.trim() === '') {
    errors.push(createError(ERROR_TYPES.LABEL_EMPTY))
  }

  if (label && label.length > LABEL_MAX_LENGTH) {
    errors.push(createError(ERROR_TYPES.LABEL_TOO_LONG))
  }

  return errors.length > 0 ? createFailure(errors) : createSuccess()
}

// ===== PLACEHOLDER VALIDATION =====
export function validatePlaceholder(placeholder) {
  if (placeholder && placeholder.length > PLACEHOLDER_MAX_LENGTH) {
    return createFailure([createError(ERROR_TYPES.PLACEHOLDER_TOO_LONG)])
  }
  return createSuccess()
}

// ===== EMAIL VALIDATION =====
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function validateEmail(value) {
  if (!value || value.trim() === '') return createSuccess()
  if (!EMAIL_REGEX.test(value)) {
    return createFailure([createError(ERROR_TYPES.INVALID_EMAIL)])
  }
  return createSuccess()
}

// ===== NUMBER VALIDATION =====
export function validateNumber(value, validation = {}) {
  const errors = []

  if (!value || value === '') return createSuccess()

  const num = parseFloat(value)
  if (isNaN(num)) {
    errors.push(createError(ERROR_TYPES.INVALID_NUMBER))
    return createFailure(errors)
  }

  if (validation.min !== '' && validation.min !== null && validation.min !== undefined) {
    const min = parseFloat(validation.min)
    if (isNaN(min)) {
      errors.push(createError(ERROR_TYPES.MIN_INVALID))
    } else if (num < min) {
      errors.push(createError(ERROR_TYPES.NUMBER_TOO_LOW, null, null, { param: min }))
    }
  }

  if (validation.max !== '' && validation.max !== null && validation.max !== undefined) {
    const max = parseFloat(validation.max)
    if (isNaN(max)) {
      errors.push(createError(ERROR_TYPES.MAX_INVALID))
    } else if (num > max) {
      errors.push(createError(ERROR_TYPES.NUMBER_TOO_HIGH, null, null, { param: max }))
    }
  }

  if (errors.length > 0) {
    const minVal = parseFloat(validation.min)
    const maxVal = parseFloat(validation.max)
    if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
      errors.push(createError(ERROR_TYPES.MIN_GREATER_THAN_MAX))
    }
  }

  return errors.length > 0 ? createFailure(errors) : createSuccess()
}

// ===== TEXT VALIDATION =====
export function validateText(value, validation = {}) {
  const errors = []

  if (!value || value === '') return createSuccess()

  const str = String(value)

  if (validation.minLength && str.length < parseInt(validation.minLength)) {
    errors.push(createError(ERROR_TYPES.TEXT_TOO_SHORT, null, null, { param: validation.minLength }))
  }

  if (validation.maxLength && str.length > parseInt(validation.maxLength)) {
    errors.push(createError(ERROR_TYPES.TEXT_TOO_LONG, null, null, { param: validation.maxLength }))
  }

  if (validation.pattern) {
    try {
      const regex = new RegExp(validation.pattern)
      if (!regex.test(str)) {
        errors.push(createError(ERROR_TYPES.INVALID_PATTERN))
      }
    } catch (e) {
      errors.push(createError(ERROR_TYPES.INVALID_REGEX))
    }
  }

  return errors.length > 0 ? createFailure(errors) : createSuccess()
}

// ===== FILE VALIDATION =====
export function validateFile(file, validation = {}) {
  const errors = []

  if (!file) return createSuccess()

  if (file instanceof File) {
    const maxSize = validation.maxSize || 10
    if (maxSize > MAX_FILE_SIZE_MB) {
      errors.push(createError(ERROR_TYPES.MAX_SIZE_EXCEEDED))
    } else if (file.size > maxSize * 1024 * 1024) {
      errors.push(createError(ERROR_TYPES.FILE_TOO_LARGE, null, null, { param: maxSize }))
    }

    const allowedTypes = validation.allowedTypes || ['*/*']
    if (!allowedTypes.includes('*/*')) {
      const fileType = file.type
      const isAllowed = allowedTypes.some(type => {
        if (type === '*/*') return true
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.split('/')[0])
        }
        return type === fileType
      })
      if (!isAllowed) {
        errors.push(createError(ERROR_TYPES.FILE_TYPENotAllowed))
      }
    }
  }

  return errors.length > 0 ? createFailure(errors) : createSuccess()
}

// ===== OPTIONS VALIDATION =====
export function validateOptions(options, fieldType) {
  const errors = []

  if (!options || !Array.isArray(options)) {
    if (fieldType === 'radio') {
      errors.push(createError(ERROR_TYPES.INSUFFICIENT_OPTIONS))
    } else {
      errors.push(createError(ERROR_TYPES.MISSING_OPTIONS))
    }
    return createFailure(errors)
  }

  if (options.length > MAX_OPTIONS) {
    errors.push(createError(ERROR_TYPES.TOO_MANY_OPTIONS))
  }

  const nonEmpty = options.filter(o => o.trim() !== '')
  if (nonEmpty.length === 0) {
    errors.push(createError(ERROR_TYPES.OPTION_EMPTY))
  }

  const uniqueOptions = new Set(nonEmpty.map(o => o.trim().toLowerCase()))
  if (uniqueOptions.size !== nonEmpty.length) {
    errors.push(createError(ERROR_TYPES.DUPLICATE_OPTIONS))
  }

  if (fieldType === 'radio' && nonEmpty.length < MIN_RADIO_OPTIONS) {
    errors.push(createError(ERROR_TYPES.INSUFFICIENT_OPTIONS))
  }

  if (fieldType === 'select' && nonEmpty.length < MIN_SELECT_OPTIONS) {
    errors.push(createError(ERROR_TYPES.MISSING_OPTIONS))
  }

  return errors.length > 0 ? createFailure(errors) : createSuccess()
}

// ===== VALIDATE SINGLE FIELD VALUE (for preview/submission) =====
export function validateFieldValue(field, value) {
  const errors = []

  if (field.required) {
    if (field.type === 'checkbox') {
      if (!value) {
        errors.push(createError(ERROR_TYPES.REQUIRED, field.id, `${field.label} is required`))
        return errors
      }
    } else if (field.type === 'file') {
      if (!value) {
        errors.push(createError(ERROR_TYPES.REQUIRED, field.id, `${field.label} is required`))
        return errors
      }
    } else {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push(createError(ERROR_TYPES.REQUIRED, field.id, `${field.label} is required`))
        return errors
      }
    }
  }

  if (!value || (typeof value === 'string' && value.trim() === '')) return errors

  switch (field.type) {
    case 'email': {
      const result = validateEmail(value)
      if (!result.valid) {
        result.errors.forEach(e => errors.push({ ...e, field: field.id }))
      }
      break
    }
    case 'number': {
      const result = validateNumber(value, field.validation || {})
      if (!result.valid) {
        result.errors.forEach(e => errors.push({ ...e, field: field.id }))
      }
      break
    }
    case 'text': {
      const result = validateText(value, field.validation || {})
      if (!result.valid) {
        result.errors.forEach(e => errors.push({ ...e, field: field.id }))
      }
      break
    }
    case 'file': {
      const result = validateFile(value, field.validation || {})
      if (!result.valid) {
        result.errors.forEach(e => errors.push({ ...e, field: field.id }))
      }
      break
    }
    default:
      break
  }

  return errors
}

// ===== VALIDATE ENTIRE FORM SCHEMA =====
export function validateFormSchema(form) {
  const results = { isValid: true, errors: [], warnings: [] }

  if (!form.id || !form.id.match(/^[a-zA-Z0-9_-]+$/)) {
    results.isValid = false
    results.errors.push(createError(ERROR_TYPES.INVALID_FORM_ID))
  }

  if (!form.fields || form.fields.length === 0) {
    results.isValid = false
    results.errors.push(createError(ERROR_TYPES.EMPTY_FORM))
    return results
  }

  if (form.fields.length > MAX_FIELDS_PER_FORM) {
    results.isValid = false
    results.errors.push(createError(ERROR_TYPES.MAX_FIELDS))
  }

  const fieldNames = []
  const fieldIds = new Set()

  for (const field of form.fields) {
    if (!field.id) {
      results.isValid = false
      results.errors.push(createError(ERROR_TYPES.REQUIRED, null, `Field missing ID`))
      continue
    }

    if (fieldIds.has(field.id)) {
      results.isValid = false
      results.errors.push(createError(ERROR_TYPES.REQUIRED, field.id, `Duplicate field ID: ${field.id}`))
    }
    fieldIds.add(field.id)

    if (field.name) {
      const nameResult = validateFieldName(field.name, fieldNames, field.id)
      if (!nameResult.valid) {
        results.isValid = false
        results.errors.push(...nameResult.errors.map(e => ({ ...e, field: field.id })))
      }
      fieldNames.push(field.name)
    }

    if (!field.label || field.label.trim() === '') {
      results.isValid = false
      results.errors.push(createError(ERROR_TYPES.LABEL_EMPTY, field.id))
    }

    if ((field.type === 'radio' || field.type === 'select') && field.options) {
      const optResult = validateOptions(field.options, field.type)
      if (!optResult.valid) {
        results.isValid = false
        results.errors.push(...optResult.errors.map(e => ({ ...e, field: field.id })))
      }
    }
  }

  return results
}

// ===== VALIDATE FIELD PROPERTIES UPDATE =====
export function validateFieldUpdate(field, properties, allFields = []) {
  const errors = []

  if (properties.name !== undefined) {
    const existingNames = allFields
      .filter(f => f.id !== field.id)
      .map(f => f.name)
      .filter(Boolean)
    const nameResult = validateFieldName(properties.name, existingNames)
    if (!nameResult.valid) {
      errors.push(...nameResult.errors)
    }
  }

  if (properties.label !== undefined) {
    const labelResult = validateLabel(properties.label)
    if (!labelResult.valid) {
      errors.push(...labelResult.errors)
    }
  }

  if (properties.placeholder !== undefined) {
    const phResult = validatePlaceholder(properties.placeholder)
    if (!phResult.valid) {
      errors.push(...phResult.errors)
    }
  }

  if (properties.options !== undefined) {
    const optResult = validateOptions(properties.options, field.type)
    if (!optResult.valid) {
      errors.push(...optResult.errors)
    }
  }

  if (properties.validation) {
    if (field.type === 'number') {
      const v = properties.validation
      if (v.min !== '' && v.min !== null && v.min !== undefined && isNaN(parseFloat(v.min))) {
        errors.push(createError(ERROR_TYPES.MIN_INVALID))
      }
      if (v.max !== '' && v.max !== null && v.max !== undefined && isNaN(parseFloat(v.max))) {
        errors.push(createError(ERROR_TYPES.MAX_INVALID))
      }
      if (!isNaN(parseFloat(v.min)) && !isNaN(parseFloat(v.max))) {
        if (parseFloat(v.min) > parseFloat(v.max)) {
          errors.push(createError(ERROR_TYPES.MIN_GREATER_THAN_MAX))
        }
      }
    }
    if (field.type === 'text' && properties.validation.pattern) {
      try {
        new RegExp(properties.validation.pattern)
      } catch (e) {
        errors.push(createError(ERROR_TYPES.INVALID_REGEX))
      }
    }
  }

  return errors.length > 0 ? createFailure(errors) : createSuccess()
}

// ===== VALIDATE FORM FOR EXPORT =====
export function validateForExport(form) {
  const schemaResult = validateFormSchema(form)
  if (!schemaResult.valid) {
    return createFailure([
      createError(ERROR_TYPES.VALIDATION_FAILED, null, 'Cannot export: fix form errors first'),
      ...schemaResult.errors
    ])
  }
  return createSuccess()
}

// ===== VALIDATE FORM FOR SUBMISSION =====
export function validateForSubmission(form, formData) {
  const allErrors = []

  for (const field of form.fields) {
    const fieldName = field.name || field.id
    const value = field.type === 'checkbox'
      ? (formData[fieldName] || false)
      : (formData[fieldName] || '')
    const fieldErrors = validateFieldValue(field, value)
    allErrors.push(...fieldErrors)
  }

  return allErrors.length > 0
    ? createFailure(allErrors)
    : createSuccess()
}

// ===== STORAGE VALIDATION =====
export function validateStorage() {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return createSuccess()
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      return createFailure([createError(ERROR_TYPES.STORAGE_FULL)])
    }
    return createFailure([createError(ERROR_TYPES.STORAGE_UNAVAILABLE)])
  }
}

// ===== SAFE JSON PARSE =====
export function safeJsonParse(jsonString) {
  try {
    const result = JSON.parse(jsonString)
    return { data: result, valid: true }
  } catch (e) {
    return { data: null, valid: false, error: createError(ERROR_TYPES.INVALID_JSON) }
  }
}
