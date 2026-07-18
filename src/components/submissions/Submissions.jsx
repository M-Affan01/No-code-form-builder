import React, { useState, useMemo } from 'react'
import { useFormBuilder } from '../../context/FormBuilderContext'
import { downloadJSON } from '../../utils/exportUtils'
import {
  FileText, Download, Trash2, X, Search, Eye,
  ChevronLeft, ChevronRight, ArrowUpDown
} from 'lucide-react'

export default function Submissions() {
  const { state, dispatch } = useFormBuilder()
  const [filter, setFilter] = useState('')
  const [sortField, setSortField] = useState('timestamp')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const pageSize = 10

  const filteredSubmissions = useMemo(() => {
    let result = [...state.submissions]
    if (filter) {
      const query = filter.toLowerCase()
      result = result.filter(sub => JSON.stringify(sub).toLowerCase().includes(query))
    }
    result.sort((a, b) => {
      let aVal = a[sortField], bVal = b[sortField]
      if (sortField === 'timestamp') { aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime() }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [state.submissions, filter, sortField, sortDirection])

  const totalPages = Math.ceil(filteredSubmissions.length / pageSize)
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const fieldNames = useMemo(() => state.fields.map(f => f.name || f.id), [state.fields])

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDirection('desc') }
  }

  const formatDate = (iso) => { try { return new Date(iso).toLocaleString() } catch { return iso } }

  return (
    <div className="submissions-panel">
      <div className="submissions-header">
        <div className="submissions-header-left">
          <FileText size={14} />
          <h3>Submissions</h3>
          <span className="submissions-count">{filteredSubmissions.length}</span>
        </div>
        <div className="submissions-actions">
          <button className="submissions-btn" onClick={() => downloadJSON(filteredSubmissions, `submissions-${state.currentFormId}.json`)}>
            <Download size={14} /> Export
          </button>
          <button
            className="submissions-btn submissions-btn-danger"
            onClick={() => window.confirm('Clear all?') && dispatch({ type: 'CLEAR_SUBMISSIONS' })}
            disabled={state.submissions.length === 0}
          >
            <Trash2 size={14} /> Clear
          </button>
          <button className="submissions-btn" onClick={() => dispatch({ type: 'SHOW_SUBMISSIONS', payload: false })}>
            <X size={14} /> Close
          </button>
        </div>
      </div>

      <div className="submissions-filters">
        <Search size={14} />
        <input
          type="text"
          className="submissions-search"
          placeholder="Search submissions..."
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1) }}
        />
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="submissions-empty">
          <FileText size={48} strokeWidth={1} />
          <h3>No Submissions</h3>
          <p>Submit the form in Preview mode to see data here</p>
        </div>
      ) : (
        <>
          <div className="submissions-table-wrapper">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('timestamp')}>
                    <ArrowUpDown size={10} /> Timestamp
                    {sortField === 'timestamp' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                  {fieldNames.map(name => (
                    <th key={name} className="sortable" onClick={() => handleSort(name)}>
                      <ArrowUpDown size={10} /> {name}
                      {sortField === name && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map(sub => (
                  <tr key={sub.submissionId}>
                    <td>{formatDate(sub.timestamp)}</td>
                    {fieldNames.map(name => (
                      <td key={name}>
                        {typeof sub.data[name] === 'boolean' ? (sub.data[name] ? 'Yes' : 'No') : String(sub.data[name] ?? '-')}
                      </td>
                    ))}
                    <td>
                      <button
                        className="submissions-action-btn"
                        onClick={() => setSelectedSubmission(selectedSubmission?.submissionId === sub.submissionId ? null : sub)}
                      >
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="submissions-pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={14} /> Prev
              </button>
              <span>Page {currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}

          {selectedSubmission && (
            <div className="submissions-detail">
              <h4>Submission Detail</h4>
              <pre>{JSON.stringify(selectedSubmission, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
