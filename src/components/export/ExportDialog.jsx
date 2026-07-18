import React, { useState } from 'react'
import { useFormBuilder } from '../../context/FormBuilderContext'
import {
  generateJSONSchema, generateHTML, generateCSS, generateJS,
  downloadJSON, downloadFile
} from '../../utils/exportUtils'
import { validateForExport } from '../../utils/validation'
import { X, Download, FileJson, FileCode, Palette, Braces, AlertTriangle } from 'lucide-react'

const TABS = [
  { id: 'json', label: 'JSON', icon: Braces },
  { id: 'html', label: 'HTML', icon: FileCode },
  { id: 'css', label: 'CSS', icon: Palette },
  { id: 'js', label: 'JS', icon: FileJson }
]

export default function ExportDialog() {
  const { state, dispatch, addToast } = useFormBuilder()
  const [activeTab, setActiveTab] = useState('json')
  const [exportErrors, setExportErrors] = useState([])

  if (!state.showExportDialog) return null

  const form = {
    id: state.currentFormId,
    title: state.formTitle,
    description: state.formDescription,
    fields: state.fields,
    submissions: state.submissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const getContent = () => {
    switch (activeTab) {
      case 'json': return JSON.stringify(generateJSONSchema(form), null, 2)
      case 'html': return generateHTML(form)
      case 'css': return generateCSS()
      case 'js': return generateJS(form)
      default: return ''
    }
  }

  const handleDownload = () => {
    const validation = validateForExport(form)
    if (!validation.valid) {
      setExportErrors(validation.errors.map(e => e.message))
      addToast('Fix form errors before exporting', 'error')
      return
    }
    setExportErrors([])
    const content = getContent()
    const ext = { json: 'json', html: 'html', css: 'css', js: 'js' }
    const mime = { json: 'application/json', html: 'text/html', css: 'text/css', js: 'text/javascript' }
    try {
      downloadFile(content, `form.${ext[activeTab]}`, mime[activeTab])
      addToast(`${activeTab.toUpperCase()} exported successfully`, 'success')
      dispatch({ type: 'SHOW_EXPORT', payload: { show: false } })
    } catch (e) {
      addToast('Export failed. Please try again.', 'error')
    }
  }

  const handleDownloadAll = () => {
    const validation = validateForExport(form)
    if (!validation.valid) {
      setExportErrors(validation.errors.map(e => e.message))
      addToast('Fix form errors before exporting', 'error')
      return
    }
    setExportErrors([])
    try {
      downloadJSON(generateJSONSchema(form), `form-schema-${state.currentFormId}.json`)
      setTimeout(() => downloadFile(generateHTML(form), 'form.html', 'text/html'), 200)
      setTimeout(() => downloadFile(generateCSS(), 'styles.css', 'text/css'), 400)
      setTimeout(() => downloadFile(generateJS(form), 'script.js', 'text/javascript'), 600)
      addToast('All files exported successfully', 'success')
      dispatch({ type: 'SHOW_EXPORT', payload: { show: false } })
    } catch (e) {
      addToast('Export failed. Please try again.', 'error')
    }
  }

  return (
    <div className="export-overlay" onClick={() => dispatch({ type: 'SHOW_EXPORT', payload: { show: false } })}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <h3>Export Form</h3>
          <button className="export-close" onClick={() => dispatch({ type: 'SHOW_EXPORT', payload: { show: false } })}>
            <X size={18} />
          </button>
        </div>

        {exportErrors.length > 0 && (
          <div className="export-errors">
            <AlertTriangle size={14} />
            <div>
              <strong>Please fix these errors first:</strong>
              <ul>{exportErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          </div>
        )}

        <div className="export-tabs">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} className={`export-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <Icon size={14} />{tab.label}
              </button>
            )
          })}
        </div>

        <div className="export-preview">
          <pre className="export-code">{getContent()}</pre>
        </div>

        <div className="export-actions">
          <button className="export-btn export-btn-download" onClick={handleDownload}>
            <Download size={14} />Download {activeTab.toUpperCase()}
          </button>
          <button className="export-btn export-btn-all" onClick={handleDownloadAll}>
            <Download size={14} />Download All
          </button>
        </div>
      </div>
    </div>
  )
}
