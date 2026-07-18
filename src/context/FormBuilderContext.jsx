import { createContext, useContext } from 'react'

const FormBuilderContext = createContext(null)

export function useFormBuilder() {
  const context = useContext(FormBuilderContext)
  if (!context) {
    throw new Error('useFormBuilder must be used within FormBuilderProvider')
  }
  return context
}

export default FormBuilderContext
