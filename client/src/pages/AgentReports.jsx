import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, Cable, Lightbulb, Search, Zap } from 'lucide-react'
import { agentRequestConfig, api, setAgentAuth } from '../lib/api.js'
import AgentHeader from '../components/AgentHeader.jsx'
import ReportLocation from '../components/ReportLocation.jsx'

const filters = [
  { label: 'Tous', value: 'all' },
  { label: 'Nouveaux', value: 'Nouveau' },
  { label: 'En cours', value: 'En cours' },
  { label: 'Résolus', value: 'Résolu' }
]

function statusClass(status) {
  if (status === 'Résolu') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (status === 'En cours') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-blue-100 text-[#2B4C9B] dark:bg-blue-900/40 dark:text-blue-300'
}

function IncidentIcon({ type = '' }) {
  const value = type.toLocaleLowerCase('fr')
  const props = { className: 'h-5 w-5 text-[#2B4C9B] dark:text-blue-300', 'aria-hidden': true }
  if (value.includes('câble') || value.includes('cable')) return <Cable {...props} />
  if (value.includes('éclairage') || value.includes('eclairage') || value.includes('poteau')) return <Lightbulb {...props} />
  if (value.includes('autre')) return <AlertTriangle {...props} />
  return <Zap {...props} />
}

function formatDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date)
    : 'Date inconnue'
}

export default function AgentReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.get('/agent/reports', agentRequestConfig())
      .then(({ data }) => { if (active) setReports(Array.isArray(data) ? data : []) })
      .catch((requestError) => {
        if (!active) return
        if ([401, 403].includes(requestError.response?.status)) {
          setAgentAuth(null)
          navigate('/agent/login', { replace: true })
          return
        }
        setError(requestError.response?.data?.error || 'Impossible de charger les signalements.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [navigate])

  const toTreat = reports.filter((report) => report.statut !== 'Résolu').length
  const visibleReports = useMemo(() => {
    const normalizedQuery = search.trim().toLocaleLowerCase('fr')
    return reports.filter((report) => {
      const matchesStatus = filter === 'all' || report.statut === filter
      const matchesSearch = !normalizedQuery || `${report.reference || ''} ${report.adresse || ''} ${report.type || ''}`.toLocaleLowerCase('fr').includes(normalizedQuery)
      return matchesStatus && matchesSearch
    })
  }, [filter, reports, search])

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#1B1F3B] dark:bg-[#0E1226] dark:text-white">
      <AgentHeader />
      <main className="mx-auto max-w-6xl px-5 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-wider text-[#2B4C9B] dark:text-blue-300">Espace professionnel</p><h1 className="mt-1 text-2xl font-extrabold md:text-3xl">Signalements</h1></div>
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[#1B1F3B] shadow-sm dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white"><p className="text-xs font-semibold text-gray-500 dark:text-gray-300">Signalements à traiter</p><p className="mt-1 text-2xl font-extrabold text-[#1B1F3B] dark:text-white">{String(toTreat).padStart(2, '0')}</p></div>
        </div>

        <section className="mb-6 rounded-3xl border border-gray-200 bg-white p-4 text-[#1B1F3B] shadow-sm dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white" aria-label="Recherche et filtres">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une référence ou un quartier…" className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2B4C9B] focus:outline-none dark:border-white/10 dark:bg-[#222A4A] dark:text-white dark:placeholder:text-gray-400" />
          </label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrer par statut">
            {filters.map((item) => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${filter === item.value ? 'bg-[#1B1F3B] text-white dark:bg-[#F5B942] dark:text-[#1B1F3B]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'}`}>{item.label}</button>)}
          </div>
        </section>

        {loading ? <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-gray-300">Chargement des signalements…</div>
          : error ? <div role="alert" className="rounded-2xl border border-red-200 bg-white/80 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-[#1B1F3B]/70 dark:text-red-300">{error}</div>
            : visibleReports.length === 0 ? <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-gray-300">Aucun signalement ne correspond à ces critères.</div>
              : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{visibleReports.map((report) => (
                <Link key={report.id} to={`/agent/incidents/${report.id}`} className="group rounded-2xl border border-gray-200 bg-white p-5 text-[#1B1F3B] shadow-sm transition-colors hover:border-[#F5B942]/70 dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white dark:hover:border-[#F5B942]/50">
                  <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50"><IncidentIcon type={report.type} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h2 className="font-bold text-[#1B1F3B] dark:text-white">{report.type || 'Incident électrique'}</h2><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(report.statut)}`}>{report.statut || 'Nouveau'}</span></div><ReportLocation report={report} className="mt-2 text-xs text-gray-600 dark:text-gray-300" /></div></div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400"><span className="truncate pr-3 font-bold text-[#2B4C9B] dark:text-[#F5B942]">{report.reference || 'Référence indisponible'} · {formatDate(report.createdAt)}</span><span className="shrink-0 font-bold text-[#2B4C9B] group-hover:underline dark:text-[#F5B942]">Traiter / Voir détail →</span></div>
                </Link>
              ))}</div>}
      </main>
    </div>
  )
}
