import { generateUniqueId, createFieldObject, validateFieldProperties, isFieldNameUnique } from '../utils/helpers'

export const initialState = {
  appState: 'IDLE',
  currentFormId: null,
  formTitle: 'Untitled Form',
  formDescription: '',
  fields: [],
  selectedFieldId: null,
  submissions: [],
  isDirty: false,
  lastSaved: null,
  isPreviewMode: false,
  showSubmissions: false,
  showExportDialog: false,
  exportType: null,
  toastMessages: [],
  formsList: [],
  dragActive: false
}

export function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_FORM': {
      const formId = generateUniqueId('form')
      return {
        ...initialState,
        currentFormId: formId,
        formTitle: action.payload?.title || 'Untitled Form',
        formDescription: action.payload?.description || '',
        fields: [],
        submissions: [],
        appState: 'IDLE',
        isDirty: true
      }
    }

    case 'LOAD_FORM': {
      const form = action.payload
      return {
        ...state,
        currentFormId: form.id,
        formTitle: form.title || 'Untitled Form',
        formDescription: form.description || '',
        fields: form.fields || [],
        submissions: form.submissions || [],
        selectedFieldId: null,
        appState: 'IDLE',
        isDirty: false,
        lastSaved: form.updatedAt || null
      }
    }

    case 'SET_FORM_TITLE':
      return {
        ...state,
        formTitle: action.payload,
        isDirty: true
      }

    case 'SET_FORM_DESCRIPTION':
      return {
        ...state,
        formDescription: action.payload,
        isDirty: true
      }

    case 'ADD_FIELD': {
      const { fieldType, position } = action.payload
      const existingNames = state.fields.map(f => f.name)
      const newField = createFieldObject(fieldType, existingNames)

      const newFields = [...state.fields]
      if (position !== undefined && position >= 0 && position <= newFields.length) {
        newFields.splice(position, 0, newField)
      } else {
        newFields.push(newField)
      }

      if (newFields.length > 50) {
        return state
      }

      return {
        ...state,
        fields: newFields,
        selectedFieldId: newField.id,
        isDirty: true,
        appState: 'BUILDING'
      }
    }

    case 'UPDATE_FIELD': {
      const { fieldId, properties } = action.payload
      const fieldIndex = state.fields.findIndex(f => f.id === fieldId)
      if (fieldIndex === -1) return state

      const field = state.fields[fieldIndex]
      const validatedProps = validateFieldProperties(properties, field.type)

      if (validatedProps.name && !isFieldNameUnique(validatedProps.name, state.fields, fieldId)) {
        return state
      }

      const updatedField = { ...field, ...validatedProps }
      const newFields = [...state.fields]
      newFields[fieldIndex] = updatedField

      return {
        ...state,
        fields: newFields,
        isDirty: true
      }
    }

    case 'DELETE_FIELD': {
      const fieldId = action.payload
      const newFields = state.fields.filter(f => f.id !== fieldId)
      return {
        ...state,
        fields: newFields,
        selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId,
        isDirty: true
      }
    }

    case 'SELECT_FIELD':
      return {
        ...state,
        selectedFieldId: action.payload,
        appState: action.payload ? 'BUILDING' : 'IDLE'
      }

    case 'REORDER_FIELDS': {
      const { fieldId, newIndex } = action.payload
      const oldIndex = state.fields.findIndex(f => f.id === fieldId)
      if (oldIndex === -1 || newIndex < 0 || newIndex >= state.fields.length) return state

      const newFields = [...state.fields]
      const [field] = newFields.splice(oldIndex, 1)
      newFields.splice(newIndex, 0, field)

      return {
        ...state,
        fields: newFields,
        isDirty: true
      }
    }

    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode,
        selectedFieldId: null,
        showSubmissions: false
      }

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
        selectedFieldId: null
      }

    case 'SHOW_SUBMISSIONS':
      return {
        ...state,
        showSubmissions: action.payload,
        isPreviewMode: false,
        selectedFieldId: null
      }

    case 'SHOW_EXPORT':
      return {
        ...state,
        showExportDialog: action.payload.show,
        exportType: action.payload.type || null
      }

    case 'ADD_SUBMISSION': {
      const submission = {
        submissionId: generateUniqueId('sub'),
        timestamp: new Date().toISOString(),
        formId: state.currentFormId,
        data: action.payload
      }
      return {
        ...state,
        submissions: [...state.submissions, submission],
        isDirty: true
      }
    }

    case 'CLEAR_SUBMISSIONS':
      return {
        ...state,
        submissions: [],
        isDirty: true
      }

    case 'DELETE_SUBMISSION': {
      return {
        ...state,
        submissions: state.submissions.filter(s => s.submissionId !== action.payload),
        isDirty: true
      }
    }

    case 'SET_SAVED':
      return {
        ...state,
        isDirty: false,
        lastSaved: new Date().toISOString()
      }

    case 'ADD_TOAST':
      return {
        ...state,
        toastMessages: [...state.toastMessages, {
          id: generateUniqueId('toast'),
          message: action.payload.message,
          type: action.payload.type || 'info',
          duration: action.payload.duration || 3000
        }]
      }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toastMessages: state.toastMessages.filter(t => t.id !== action.payload)
      }

    case 'SET_FORMS_LIST':
      return {
        ...state,
        formsList: action.payload
      }

    case 'SET_DRAG_ACTIVE':
      return {
        ...state,
        dragActive: action.payload
      }

    case 'SET_APP_STATE':
      return {
        ...state,
        appState: action.payload
      }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}
