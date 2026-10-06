import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Clock3, X, Zap } from 'lucide-react'
import { api, publicFileUrl } from '../lib/api.js'
import CitizenBottomNav from '../components/CitizenBottomNav.jsx'
import CitizenDesktopHeader from '../components/CitizenDesktopHeader.jsx'
import ReportLocation from '../components/ReportLocation.jsx'

function statusStyle(status) {
  if (status === 'Résolu') return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
  if (status === 'En cours') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200'
  return 'bg-blue-100 font-bold text-[#2B4C9B] dark:bg-blue-900/40 dark:text-blue-200'
}

function formatDate(value, includeTime = true) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return 'Date indisponible'
  return new Intl.DateTimeFormat('fr-FR', includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' }).format(date)
}

function ProgressTimeline({ report }) {
  const resolved = report.statut === 'Résolu'
  const inProgress = report.statut === 'En cours'
  const verified = inProgress || resolved
  const steps = [
    { title: 'Signalement envoyé', detail: formatDate(report.createdAt), complete: true },
    { title: 'Signalement vérifié', detail: verified ? 'Signalement validé' : 'En attente de vérification', complete: verified },
    { title: 'Intervention en cours', detail: inProgress ? 'Une équipe intervient actuellement' : resolved ? 'Intervention terminée' : 'En attente de prise en charge', complete: inProgress || resolved, active: inProgress },
    { title: 'Incident résolu', detail: resolved ? 'Incident traité' : 'En attente de résolution', complete: resolved, active: resolved }
  ]

  return (
    <section className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:shadow-none" aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="mb-6 text-xs font-bold uppercase tracking-wider text-gray-400">Avancement</h2>
      <ol className="space-y-0">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            {index < steps.length - 1 && <span className={`absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px ${step.complete ? 'bg-green-300 dark:bg-green-700' : 'bg-gray-200 dark:bg-white/10'}`} aria-hidden="true" />}
            <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step.complete ? 'bg-[#1B1F3B] text-white dark:bg-[#F5B942] dark:text-[#1B1F3B]' : step.active ? 'bg-[#F5B942] text-[#1B1F3B]' : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500'}`}>
              {step.complete ? <Check className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
            </span>
            <div className="pt-0.5">
              <p className={`text-sm font-semibold ${step.complete || step.active ? 'text-[#1B1F3B] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{step.title}</p>
              <p className={`mt-1 text-xs ${step.complete || step.active ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function ReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [photoOpen, setPhotoOpen] = useState(false)

  useEffect(() => {
    let active = true
    if (!localStorage.getItem('alert-e2c-token')) {
      setError('Vous devez être connecté pour consulter ce signalement.')
      setLoading(false)
      return () => { active = false }
    }
    api.get(`/reports/mine/${id}`)
      .then(({ data }) => { if (active) setReport(data) })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.error || 'Impossible de charger ce signalement.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (!photoOpen) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') setPhotoOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [photoOpen])

  const content = loading
    ? <div className="rounded-2xl border border-white/80 bg-white/70 p-6 text-sm text-gray-600 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-gray-300 dark:shadow-none">Chargement du signalement…</div>
    : error
      ? <div role="alert" className="rounded-2xl border border-red-200/70 bg-white/75 p-6 text-sm text-red-700 shadow-sm backdrop-blur-xl dark:border-red-900/40 dark:bg-[#1B1F3B]/80 dark:text-red-300">{error}</div>
      : report && (
        <div className="space-y-5">
          <section className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/80 border-t-2 border-t-[#F5B942] bg-white/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:border-t-[#F5B942] dark:bg-[#1B1F3B]/80 dark:shadow-none">
            <div className="min-w-0 border-l-2 border-[#1B1F3B]/15 pl-4 dark:border-white/20"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Référence du signalement</p><h2 className="break-all text-xl font-extrabold tracking-tight text-[#1B1F3B] dark:text-white md:text-2xl">{report.reference || `E2C-${report.id}`}</h2><p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Envoyé le {formatDate(report.createdAt)}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(report.statut)}`}>{report.statut || 'Nouveau'}</span>
          </section>

          <ProgressTimeline report={report} />

          <section className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:shadow-none" aria-labelledby="information-heading">
            <h2 id="information-heading" className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Informations</h2>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Type d’incident</dt><dd className="mt-1 text-sm font-semibold text-[#1B1F3B] dark:text-white">{report.type || 'Non précisé'}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Localisation</dt><dd className="mt-1 text-sm text-gray-700 dark:text-gray-200"><ReportLocation report={report} /></dd></div>
              <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-200">{report.description || 'Aucune description.'}</dd></div>
            </dl>
          </section>

          {report.photoUrl && <section className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:shadow-none"><h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Photo</h2><button type="button" onClick={() => setPhotoOpen(true)} className="block w-full overflow-hidden rounded-2xl border border-gray-200/70 focus:outline-none focus:ring-2 focus:ring-[#2B4C9B] dark:border-white/10" aria-label="Agrandir la photo du signalement"><img src={publicFileUrl(report.photoUrl)} alt={`Photo du signalement ${report.reference || ''}`} className="max-h-64 w-full object-cover" /></button><p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Touchez la photo pour l’agrandir.</p></section>}
        </div>
      )

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#1B1F3B] dark:bg-[#0E1226] dark:text-white">
      <div className="hidden md:block"><CitizenDesktopHeader active="reports" /></div>
      <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-5 md:my-8 md:min-h-0 md:max-w-4xl md:rounded-3xl md:border md:border-white/80 md:bg-white/65 md:p-8 md:shadow-xl md:shadow-slate-900/5 md:backdrop-blur-xl dark:md:border-white/10 dark:md:bg-[#1B1F3B]/80 dark:md:shadow-none">
        <header className="mb-5 md:mb-6">
          <div className="mb-4 flex items-center justify-between">
            <Link to="/mes-signalements" aria-label="Retour à mes signalements" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1B1F3B] transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#1B1F3B]/90 dark:text-white dark:hover:bg-white/10"><ArrowLeft className="h-5 w-5" /></Link>
            <Link to="/accueil" aria-label="Accueil E2C" className="inline-flex items-center gap-2 md:hidden"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B1F3B] text-white"><Zap className="h-4 w-4" /></span><span className="text-lg font-extrabold tracking-tight text-[#1B1F3B] dark:text-white">E2C<span className="text-[#F5B942]">.</span></span></Link>
          </div>
          <h1 className="text-lg font-bold text-[#1B1F3B] dark:text-white md:text-2xl">Suivi du signalement</h1>
        </header>
        {content}
      </main>
      <div className="md:hidden"><CitizenBottomNav active="reports" /></div>
      {photoOpen && report?.photoUrl && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Photo agrandie"><button type="button" onClick={() => setPhotoOpen(false)} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Fermer l’agrandissement"><X className="h-6 w-6" /></button><img src={publicFileUrl(report.photoUrl)} alt={`Photo agrandie du signalement ${report.reference || ''}`} className="max-h-[90vh] max-w-full rounded-2xl object-contain" onClick={() => setPhotoOpen(false)} /></div>}
    </div>
  )
}
