import { validateStorage, safeJsonParse } from './validation'

const STORAGE_PREFIX = 'formbuilder_'

export function isStorageAvailable() {
  return validateStorage().valid
}

export function saveFormToStorage(form) {
  const storageCheck = validateStorage()
  if (!storageCheck.valid) {
    console.error('Storage not available:', storageCheck.errors)
    return { success: false, error: storageCheck.errors[0] }
  }

  try {
    const key = `${STORAGE_PREFIX}form_${form.id}`
    const data = { ...form, updatedAt: new Date().toISOString() }
    const serialized = JSON.stringify(data)

    if (serialized.length > 5 * 1024 * 1024) {
      console.warn('Form data is very large:', serialized.length, 'bytes')
    }

    localStorage.setItem(key, serialized)
    updateFormsList(form.id, form.title)
    return { success: true, size: serialized.length }
  } catch (error) {
    console.error('Save failed:', error)
    if (error.name === 'QuotaExceededError') {
      cleanupStorage()
      try {
        localStorage.setItem(`${STORAGE_PREFIX}form_${form.id}`, JSON.stringify(form))
        return { success: true, warning: 'Storage was near limit, old data cleaned' }
      } catch (retryError) {
        return { success: false, error: { type: 'storageFull', message: 'Storage is full. Please delete some forms.' } }
      }
    }
    return { success: false, error: { type: 'saveFailed', message: `Save failed: ${error.message}` } }
  }
}

export function loadFormFromStorage(formId) {
  if (!isStorageAvailable()) {
    return { data: null, error: { type: 'storageUnavailable', message: 'Storage is not available' } }
  }

  if (!formId || typeof formId !== 'string') {
    return { data: null, error: { type: 'invalidId', message: 'Invalid form ID' } }
  }

  try {
    const key = `${STORAGE_PREFIX}form_${formId}`
    const rawData = localStorage.getItem(key)

    if (!rawData) {
      return { data: null, error: { type: 'notFound', message: `Form "${formId}" not found` } }
    }

    const parsed = safeJsonParse(rawData)
    if (!parsed.valid) {
      return { data: null, error: parsed.error }
    }

    return { data: parsed.data, error: null }
  } catch (error) {
    console.error('Load failed:', error)
    return { data: null, error: { type: 'loadFailed', message: `Load failed: ${error.message}` } }
  }
}

export function deleteFormFromStorage(formId) {
  if (!isStorageAvailable()) return false

  if (!formId || typeof formId !== 'string') return false

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}form_${formId}`)
    localStorage.removeItem(`${STORAGE_PREFIX}submissions_${formId}`)
    removeFromFormsList(formId)
    return true
  } catch (error) {
    console.error('Delete failed:', error)
    return false
  }
}

export function getAllSavedForms() {
  if (!isStorageAvailable()) return []

  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`${STORAGE_PREFIX}form_`))
    const forms = []

    for (const key of keys) {
      const formId = key.replace(`${STORAGE_PREFIX}form_`, '')
      try {
        const rawData = localStorage.getItem(key)
        const parsed = safeJsonParse(rawData)
        if (parsed.valid && parsed.data) {
          forms.push({
            id: formId,
            title: parsed.data.title || 'Untitled Form',
            fieldCount: (parsed.data.fields || []).length,
            createdAt: parsed.data.createdAt,
            updatedAt: parsed.data.updatedAt,
            submissionCount: (parsed.data.submissions || []).length
          })
        }
      } catch (e) {
        console.warn(`Skipping corrupted form ${formId}:`, e)
        continue
      }
    }

    return forms.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
  } catch (error) {
    console.error('Failed to list forms:', error)
    return []
  }
}

function updateFormsList(formId, title) {
  try {
    const listKey = `${STORAGE_PREFIX}forms_list`
    const rawList = localStorage.getItem(listKey)
    const parsed = safeJsonParse(rawList)
    let list = parsed.valid ? parsed.data : []

    const existing = list.findIndex(f => f.id === formId)
    const entry = { id: formId, title, updatedAt: new Date().toISOString() }

    if (existing >= 0) {
      list[existing] = entry
    } else {
      list.push(entry)
    }

    localStorage.setItem(listKey, JSON.stringify(list))
  } catch (e) {
    // Non-critical, silently continue
  }
}

function removeFromFormsList(formId) {
  try {
    const listKey = `${STORAGE_PREFIX}forms_list`
    const rawList = localStorage.getItem(listKey)
    const parsed = safeJsonParse(rawList)
    if (!parsed.valid) return

    const list = parsed.data.filter(f => f.id !== formId)
    localStorage.setItem(listKey, JSON.stringify(list))
  } catch (e) {
    // Non-critical
  }
}

function cleanupStorage() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`${STORAGE_PREFIX}form_`))
    const entries = []

    for (const key of keys) {
      const formId = key.replace(`${STORAGE_PREFIX}form_`, '')
      try {
        const rawData = localStorage.getItem(key)
        const parsed = safeJsonParse(rawData)
        if (parsed.valid && parsed.data) {
          entries.push({
            key,
            formId,
            updatedAt: parsed.data.updatedAt || '2000-01-01'
          })
        }
      } catch (e) {
        entries.push({ key, formId, updatedAt: '2000-01-01' })
      }
    }

    entries.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))

    const toRemove = entries.slice(0, Math.ceil(entries.length / 3))
    for (const entry of toRemove) {
      localStorage.removeItem(entry.key)
      localStorage.removeItem(`${STORAGE_PREFIX}submissions_${entry.formId}`)
    }
  } catch (e) {
    // Best effort cleanup
  }
}

export function saveSubmissionsToStorage(formId, submissions) {
  if (!isStorageAvailable()) return false

  try {
    localStorage.setItem(`${STORAGE_PREFIX}submissions_${formId}`, JSON.stringify(submissions))
    return true
  } catch (error) {
    console.error('Failed to save submissions:', error)
    return false
  }
}

export function getStorageUsage() {
  let total = 0
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage.getItem(key).length * 2
      }
    }
  } catch (e) {
    // ignore
  }
  return {
    used: total,
    usedMB: (total / (1024 * 1024)).toFixed(2),
    available: isStorageAvailable()
  }
}
