import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useFormBuilder } from './context/FormBuilderContext'
import { FormBuilderProvider } from './context/FormBuilderProvider'
import ErrorBoundary from './components/common/ErrorBoundary'
import Header from './components/common/Header'
import Toast from './components/common/Toast'
import Toolbox from './components/toolbox/Toolbox'
import Canvas from './components/canvas/Canvas'
import PropertiesPanel from './components/properties/PropertiesPanel'
import Preview from './components/preview/Preview'
import Submissions from './components/submissions/Submissions'
import ExportDialog from './components/export/ExportDialog'

function FormBuilderApp() {
  const { state, dispatch } = useFormBuilder()

  React.useEffect(() => {
    if (!state.currentFormId) {
      dispatch({ type: 'CREATE_FORM', payload: { title: 'Untitled Form' } })
    }
  }, [])

  const renderMainContent = () => {
    if (state.isPreviewMode) return <Preview />
    if (state.showSubmissions) return <Submissions />
    return (
      <div className="builder-layout">
        <Toolbox />
        <Canvas />
        <PropertiesPanel />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">{renderMainContent()}</main>
      <ExportDialog />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <FormBuilderProvider>
          <FormBuilderApp />
        </FormBuilderProvider>
      </DndProvider>
    </ErrorBoundary>
  )
}
