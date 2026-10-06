import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Clock3, X } from 'lucide-react'
import { agentRequestConfig, api, publicFileUrl, setAgentAuth } from '../lib/api.js'
import AgentHeader from '../components/AgentHeader.jsx'
import ReportLocation from '../components/ReportLocation.jsx'
import ReportMapPreview from '../components/ReportMapPreview.jsx'

function statusClass(status) {
  if (status === 'Résolu') return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
  if (status === 'En cours') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
}

function formatDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : 'Date inconnue'
}

export default function AgentIncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState('En cours')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [photoOpen, setPhotoOpen] = useState(false)

  useEffect(() => {
    let active = true
    api.get(`/agent/reports/${id}`, agentRequestConfig())
      .then(({ data }) => { if (active) { setReport(data); setStatus(data.statut === 'Résolu' ? 'Résolu' : 'En cours') } })
      .catch((requestError) => {
        if (!active) return
        if ([401, 403].includes(requestError.response?.status)) {
          setAgentAuth(null)
          navigate('/agent/login', { replace: true })
          return
        }
        setError(requestError.response?.data?.error || 'Impossible de charger le signalement.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, navigate])

  useEffect(() => {
    if (!photoOpen) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') setPhotoOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [photoOpen])

  async function updateStatus(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { data } = await api.patch(`/reports/${id}/status`, { statut: status, note }, agentRequestConfig())
      setReport(data)
      setNote('')
      setSuccess('Le statut du signalement a été mis à jour.')
    } catch (requestError) {
      if ([401, 403].includes(requestError.response?.status)) {
        setAgentAuth(null)
        navigate('/agent/login', { replace: true })
        return
      }
      setError(requestError.response?.data?.error || 'La mise à jour a échoué.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#1B1F3B] dark:bg-[#0E1226] dark:text-white">
      <AgentHeader />
      <main className="mx-auto max-w-5xl px-5 py-6 md:px-6 md:py-8">
        <Link to="/agent/incidents" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2B4C9B] hover:underline dark:text-blue-300"><ArrowLeft className="h-4 w-4" />Retour aux signalements</Link>
        {loading ? <div className="rounded-2xl border border-white/80 bg-white/75 p-6 text-sm text-gray-600 dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-gray-300">Chargement de la fiche…</div>
          : error && !report ? <div role="alert" className="rounded-2xl border border-red-200 bg-white/80 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-[#1B1F3B]/80 dark:text-red-300">{error}</div>
            : report && <>
              <section className="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-white/80 border-t-2 border-t-[#F5B942] bg-white/75 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:border-t-[#F5B942] dark:bg-[#1B1F3B]/80 dark:shadow-none">
                <div><p className="text-xs font-bold uppercase tracking-wider text-gray-400">Fiche incident</p><h1 className="mt-1 break-all text-2xl font-extrabold text-[#1B1F3B] dark:text-white">{report.reference || `E2C-${report.id}`}</h1><p className="mt-2 text-sm font-semibold">{report.type}</p><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Reçu le {formatDate(report.createdAt)}</p></div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(report.statut)}`}>{report.statut || 'Nouveau'}</span>
              </section>

              <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
                <div className="space-y-5">
                  <section className="rounded-2xl border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80"><h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Informations</h2><dl className="space-y-4"><div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Localisation</dt><dd className="mt-1 text-sm text-gray-700 dark:text-gray-200"><ReportLocation report={report} /></dd></div><div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-200">{report.description || 'Aucune description fournie.'}</dd></div></dl></section>
                  <ReportMapPreview report={report} />
                  {report.photoUrl && <section className="rounded-2xl border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80"><h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Photo</h2><button type="button" onClick={() => setPhotoOpen(true)} aria-label="Agrandir la photo" className="block w-full overflow-hidden rounded-2xl border border-gray-200/70 focus:outline-none focus:ring-2 focus:ring-[#2B4C9B] dark:border-white/10"><img src={publicFileUrl(report.photoUrl)} alt={`Photo de ${report.reference || 'l’incident'}`} className="max-h-80 w-full object-cover" /></button><p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Cliquer pour agrandir.</p></section>}
                  {Array.isArray(report.notesIntervention) && report.notesIntervention.length > 0 && <section className="rounded-2xl border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80"><h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Notes d’intervention</h2><ul className="space-y-3">{report.notesIntervention.slice().reverse().map((entry, index) => <li key={`${entry.createdAt}-${index}`} className="border-l-2 border-[#F5B942] pl-3"><p className="text-sm text-gray-700 dark:text-gray-200">{entry.texte}</p><p className="mt-1 text-xs text-gray-400">{formatDate(entry.createdAt)}</p></li>)}</ul></section>}
                </div>

                <aside className="h-fit rounded-2xl border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Action agent</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Mettre à jour l’état de prise en charge.</p>
                  <form onSubmit={updateStatus} className="mt-5 space-y-4">
                    <fieldset><legend className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-300">Nouveau statut</legend><div className="grid grid-cols-2 gap-2">{['En cours', 'Résolu'].map((item) => <button key={item} type="button" aria-pressed={status === item} onClick={() => setStatus(item)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${status === item ? item === 'Résolu' ? 'border-green-700 bg-green-700 text-white' : 'border-[#2B4C9B] bg-[#1B1F3B] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-300'}`}>{item}</button>)}</div></fieldset>
                    <label htmlFor="intervention-note" className="block text-xs font-bold text-gray-600 dark:text-gray-300">Notes d’intervention <span className="font-normal text-gray-400">(facultatif)</span><textarea id="intervention-note" rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ex. Équipe dépêchée sur place…" className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:border-[#2B4C9B] focus:outline-none dark:border-white/10 dark:bg-[#222A4A] dark:text-white dark:placeholder:text-gray-400" /></label>
                    {error && <p role="alert" className="text-xs text-red-700 dark:text-red-300">{error}</p>}{success && <p role="status" className="text-xs text-green-700 dark:text-green-300">{success}</p>}
                    <button type="submit" disabled={saving || (report.statut === status && !note.trim())} className="yellow-flash flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"><span>{saving ? 'Mise à jour…' : 'Mettre à jour l’incident'}</span>{!saving && <Check className="h-4 w-4" />}</button>
                  </form>
                </aside>
              </div>
            </>}
      </main>
      {photoOpen && report?.photoUrl && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Photo agrandie"><button type="button" onClick={() => setPhotoOpen(false)} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Fermer"><X className="h-6 w-6" /></button><img src={publicFileUrl(report.photoUrl)} alt={`Photo agrandie du signalement ${report.reference || ''}`} className="max-h-[90vh] max-w-full rounded-2xl object-contain" onClick={() => setPhotoOpen(false)} /></div>}
    </div>
  )
}
