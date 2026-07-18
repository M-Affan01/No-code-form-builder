import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleHardReset = () => {
    try {
      localStorage.removeItem('formbuilder_forms_list')
    } catch (e) {}
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <AlertTriangle size={48} strokeWidth={1.5} />
            <h2>Something went wrong</h2>
            <p className="error-message">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <div className="error-actions">
              <button className="error-btn" onClick={this.handleReset}>
                <RefreshCw size={14} /> Try Again
              </button>
              <button className="error-btn error-btn-secondary" onClick={this.handleHardReset}>
                Reload Page
              </button>
            </div>
            {this.state.errorInfo && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error?.stack}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
