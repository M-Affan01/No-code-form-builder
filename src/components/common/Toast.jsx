import React from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useFormBuilder } from '../../context/FormBuilderContext'

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle
}

export default function Toast() {
  const { state, dispatch } = useFormBuilder()

  if (state.toastMessages.length === 0) return null

  return (
    <div className="toast-container">
      {state.toastMessages.map(toast => {
        const Icon = ICONS[toast.type] || Info
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={16} />
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}>
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
