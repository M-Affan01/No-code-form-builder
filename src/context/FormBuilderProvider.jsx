import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import FormBuilderContext from './FormBuilderContext'
import { reducer, initialState } from './reducer'
import { saveFormToStorage, loadFormFromStorage, getAllSavedForms } from '../utils/storage'
import { generateUniqueId } from '../utils/helpers'
import { validateFormSchema } from '../utils/validation'

export function FormBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const autoSaveTimerRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    try {
      const formsList = getAllSavedForms()
      dispatch({ type: 'SET_FORMS_LIST', payload: formsList })
    } catch (e) {
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Failed to load forms list', type: 'error' } })
    }
  }, [])

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setInterval(() => {
      const currentState = stateRef.current
      if (currentState.isDirty && currentState.currentFormId) {
        const form = {
          id: currentState.currentFormId,
          title: currentState.formTitle,
          description: currentState.formDescription,
          fields: currentState.fields,
          submissions: currentState.submissions,
          createdAt: loadFormFromStorage(currentState.currentFormId)?.data?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        const result = saveFormToStorage(form)
        if (result.success) {
          dispatch({ type: 'SET_SAVED' })
        } else if (result.error) {
          dispatch({ type: 'ADD_TOAST', payload: { message: result.error.message, type: 'error' } })
        }
      }
    }, 5000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [])

  const saveCurrentForm = useCallback(() => {
    const currentState = stateRef.current
    if (!currentState.currentFormId) {
      return { success: false, error: 'No form to save' }
    }

    const existingResult = loadFormFromStorage(currentState.currentFormId)
    const form = {
      id: currentState.currentFormId,
      title: currentState.formTitle,
      description: currentState.formDescription,
      fields: currentState.fields,
      submissions: currentState.submissions,
      createdAt: existingResult.data?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = saveFormToStorage(form)
    if (result.success) {
      dispatch({ type: 'SET_SAVED' })
      try {
        const formsList = getAllSavedForms()
        dispatch({ type: 'SET_FORMS_LIST', payload: formsList })
      } catch (e) { /* non-critical */ }
    }
    return result
  }, [])

  const loadForm = useCallback((formId) => {
    const result = loadFormFromStorage(formId)
    if (result.data) {
      dispatch({ type: 'LOAD_FORM', payload: result.data })
      return { success: true }
    }
    return { success: false, error: result.error }
  }, [])

  const createNewForm = useCallback((title) => {
    dispatch({ type: 'CREATE_FORM', payload: { title } })
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    dispatch({ type: 'ADD_TOAST', payload: { message, type, duration } })
  }, [])

  const validateCurrentForm = useCallback(() => {
    const currentState = stateRef.current
    const form = {
      id: currentState.currentFormId,
      title: currentState.formTitle,
      fields: currentState.fields
    }
    return validateFormSchema(form)
  }, [])

  const value = {
    state,
    dispatch,
    saveCurrentForm,
    loadForm,
    createNewForm,
    addToast,
    validateCurrentForm
  }

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  )
}
