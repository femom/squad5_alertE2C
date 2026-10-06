import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { AlertTriangle, Cable, Lightbulb, LoaderCircle, PlusCircle, Zap } from 'lucide-react'
import { useReports } from '../contexts/ReportsContext.jsx'
import CitizenBottomNav from '../components/CitizenBottomNav.jsx'
import CitizenDesktopHeader from '../components/CitizenDesktopHeader.jsx'
import ReportLocation from '../components/ReportLocation.jsx'

function ReportIcon({ type = '' }) {
  const value = type.toLowerCase()
  const className = 'h-5 w-5 text-[#2B4C9B]'
  if (value.includes('câble') || value.includes('cable')) return <Cable className={className} aria-hidden="true" />
  if (value.includes('éclairage') || value.includes('eclairage') || value.includes('poteau')) return <Lightbulb className={className} aria-hidden="true" />
  if (value.includes('autre')) return <AlertTriangle className={className} aria-hidden="true" />
  return <Zap className={className} aria-hidden="true" />
}

function statutStyle(statut) {
  if (statut === 'Résolu') return 'bg-green-100 text-green-800'
  if (statut === 'En cours') return 'bg-orange-100 text-orange-800'
  return 'bg-blue-100 text-blue-800'
}

function formatDate(value) {
  if (!value) return 'Date inconnue'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date inconnue'
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function reportTitle(report) {
  const type = report.type || 'Incident électrique'
  if (report.statut === 'En cours') return `${type} en cours`
  if (report.statut === 'Résolu') return `${type} résolu`
  return `${type} signalé`
}

function ReportCard({ report, index = 0 }) {
  return (
    <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.05 }}>
    <Link to={`/mes-signalements/${report.id}`} className="block rounded-3xl border border-white/90 bg-white/80 p-6 text-[#1B1F3B] shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white dark:shadow-none">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2B4C9B]"><ReportIcon type={report.type} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-bold leading-5 dark:text-gray-100">{reportTitle(report)}</h2>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statutStyle(report.statut)}`}>{report.statut || 'Nouveau'}</span>
          </div>
          <ReportLocation report={report} className="mt-1 text-xs text-gray-500 dark:text-gray-400" />
          <p className="mt-4 border-t border-gray-100 pt-3 text-[11px] text-gray-400 dark:border-white/10 dark:text-gray-500">{report.reference || 'Référence indisponible'} <span className="mx-1">•</span> {formatDate(report.createdAt)}</p>
        </div>
      </div>
    </Link>
    </m.div>
  )
}

function Counter({ count }) {
  return (
    <section className="mb-6 flex items-center justify-between rounded-2xl border border-white/90 bg-white/80 p-4 text-[#1B1F3B] shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white dark:shadow-none">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/70">Signalements en cours</p>
      <p className="whitespace-nowrap text-right text-lg font-bold"><span className="mr-1 text-2xl">{String(count).padStart(2, '0')}</span><span className="text-xs font-medium">{count > 1 ? 'signalements' : 'signalement'}</span></p>
    </section>
  )
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-white/90 bg-white/80 p-6 text-center text-[#1B1F3B] shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white dark:shadow-none">
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2B4C9B]"><ReportIcon /></span>
      <h2 className="font-bold">Aucun signalement pour le moment</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Vos démarches et leur avancement apparaîtront ici.</p>
      <Link to="/nouveau-signalement" className="yellow-flash group mt-4 inline-flex rounded-xl px-4 py-3 text-sm font-bold">Faire un signalement <span className="flash-arrow ml-1">→</span></Link>
    </section>
  )
}

export default function MyReports() {
  const navigate = useNavigate()
  const { reports, loading, error, loadReports } = useReports()

  useEffect(() => {
    if (!localStorage.getItem('alert-e2c-token')) {
      navigate('/login', { replace: true })
      return
    }
    loadReports().catch(() => {})
  }, [navigate])

  const enCours = reports.filter((report) => report.statut !== 'Résolu').length
  const reportContent = loading
    ? <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-500 dark:border-white/10 dark:bg-[#1B1F3B]/60 dark:text-gray-300"><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Chargement de vos signalements…</div>
    : error
      ? <div role="alert" className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-700 dark:border-red-900/40 dark:bg-[#1B1F3B]/60 dark:text-red-300">{error}</div>
      : reports.length === 0
        ? <EmptyState />
        : <div className="space-y-3 md:grid md:grid-cols-2 md:gap-5 md:space-y-0 lg:grid-cols-3">{reports.map((report, index) => <ReportCard key={report.id} report={report} index={index} />)}</div>

  return (
    <div className="min-h-screen w-full">
      <div className="block min-h-screen bg-[#F7F6F0] dark:bg-[#0E1226] md:hidden">
        <main className="relative mx-auto flex h-screen min-h-screen w-full max-w-md flex-col justify-between overflow-x-hidden overflow-y-auto bg-[#F7F6F0] p-5 pb-24 text-[#1B1F3B] shadow-xl dark:bg-[#0E1226] dark:text-gray-100">
          <div>
            <header className="mb-6 flex items-center justify-between">
              <Link to="/accueil" aria-label="Retour à l'accueil citoyen" className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-2xl leading-none hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">‹</Link>
              <h1 className="text-base font-bold">Mes signalements</h1>
              <Link to="/nouveau-signalement" aria-label="Créer un signalement" className="yellow-flash yellow-flash-icon flex h-10 w-10 items-center justify-center rounded-full"><PlusCircle className="h-6 w-6" /></Link>
            </header>
            <Counter count={enCours} />
            {reportContent}
          </div>
          <CitizenBottomNav active="reports" />
        </main>
      </div>

      <div className="hidden min-h-screen bg-[#F7F6F0] text-[#1B1F3B] dark:bg-[#0E1226] dark:text-gray-100 md:block">
        <CitizenDesktopHeader active="reports" />
        <main className="mx-auto max-w-6xl px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div><p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Votre espace citoyen</p><h1 className="mt-1 text-3xl font-extrabold">Mes signalements</h1></div>
            <Link to="/nouveau-signalement" className="yellow-flash rounded-xl px-5 py-3 text-sm font-bold">+ Nouveau signalement</Link>
          </div>
          <Counter count={enCours} />
          {reportContent}
        </main>
      </div>
    </div>
  )
}
