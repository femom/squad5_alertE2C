import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { api } from '../lib/api.js'

const ReportsContext = createContext(null)

function sortReports(reports) {
  return [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestRef = useRef(null)

  const loadReports = useCallback(async ({ force = false } = {}) => {
    if (reports !== null && !force) return reports
    if (requestRef.current && !force) return requestRef.current
    setLoading(true)
    setError('')
    requestRef.current = api.get('/reports/mine')
      .then(({ data }) => {
        const sorted = sortReports(data)
        setReports(sorted)
        return sorted
      })
      .catch((requestError) => {
        setError('Impossible de charger vos signalements. Vérifiez votre connexion puis réessayez.')
        throw requestError
      })
      .finally(() => {
        requestRef.current = null
        setLoading(false)
      })
    return requestRef.current
  }, [reports])

  const addReport = useCallback((report) => {
    if (!report) return
    setReports((current) => sortReports([report, ...(current || []).filter((item) => item.id !== report.id)]))
  }, [])

  return <ReportsContext.Provider value={{ reports: reports || [], hasLoaded: reports !== null, loading, error, loadReports, addReport }}>{children}</ReportsContext.Provider>
}

export function useReports() {
  const context = useContext(ReportsContext)
  if (!context) throw new Error('useReports doit être utilisé dans ReportsProvider')
  return context
}
