import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ClipboardList, Zap } from 'lucide-react'
import { api, getAuthUser } from '../lib/api.js'
import CitizenBottomNav from '../components/CitizenBottomNav.jsx'
import CitizenDesktopHeader from '../components/CitizenDesktopHeader.jsx'
import ReportLocation from '../components/ReportLocation.jsx'

function statutStyle(statut) {
  if (statut === 'Résolu') return 'bg-green-100 text-green-800'
  if (statut === 'En cours') return 'bg-orange-100 text-orange-800'
  return 'bg-blue-100 text-blue-800'
}

function LatestReport({ report, loading }) {
  return (
    <section className="citizen-card rounded-3xl border border-white/90 bg-white/95 p-5 text-[#1B1F3B] shadow-md shadow-slate-200/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#1B1F3B]/95 dark:text-white dark:shadow-none" aria-labelledby="latest-report-heading">
      <h2 id="latest-report-heading" className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Dernier signalement</h2>
      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-400">Chargement de vos signalements…</p>
      ) : report ? (
        <Link to={`/mes-signalements/${report.id}`} className="flex items-center justify-between gap-3">
          <span className="min-w-0"><span className="block truncate text-sm font-bold text-[#1B1F3B] dark:text-gray-100">{report.type}</span><ReportLocation report={report} className="mt-1 text-xs text-gray-500 dark:text-gray-400" /></span>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statutStyle(report.statut)}`}>{report.statut}</span>
        </Link>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white/90 p-4 text-center text-xs text-gray-600 dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-gray-300">Aucun signalement pour le moment.</div>
      )}
    </section>
  )
}

export default function CitizenHome() {
  const navigate = useNavigate()
  const user = getAuthUser()
  const [latestReport, setLatestReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('alert-e2c-token')) {
      navigate('/login', { replace: true })
      return
    }

    api.get('/reports/mine')
      .then(({ data }) => {
        const recent = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setLatestReport(recent[0] || null)
      })
      .catch(() => setLatestReport(null))
      .finally(() => setLoading(false))
  }, [navigate])

  const nom = user?.nom || user?.nomComplet || ''
  const prenom = nom.trim().split(/\s+/)[0] || ''
  const avatar = prenom.charAt(0).toUpperCase()

  return (
    <div className="citizen-home h-full min-h-0 w-full overflow-hidden">
      <div className="block md:hidden">
        <main className="citizen-mobile-home relative mx-auto flex h-full min-h-0 w-full max-w-md flex-col justify-between overflow-hidden bg-[#F7F6F0] p-4 pb-20 text-[#1B1F3B] dark:bg-[#0E1226] dark:text-white">
          <div>
            <header className="mb-4 flex items-center justify-between">
              <Link to="/accueil" className="flex items-center gap-2" aria-label="Accueil E2C">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B1F3B] text-white"><Zap className="h-5 w-5" /></span>
                <span className="text-xl font-extrabold tracking-tight">E2C<span className="text-[#F5B942]">.</span></span>
              </Link>
              <span aria-label={prenom ? `Profil de ${nom}` : 'Profil utilisateur'} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5B942] text-sm font-bold text-[#1B1F3B]">{avatar}</span>
            </header>

            <section className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Votre espace citoyen</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Bonjour{prenom ? ` ${prenom}` : ''}.</h1>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Ensemble, rendons notre quartier éclairé.</p>
            </section>

            <section className="citizen-card mb-3 rounded-3xl border border-white/90 bg-white/95 p-4 text-[#1B1F3B] shadow-md shadow-slate-200/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#1B1F3B]/95 dark:text-white dark:shadow-none">
              <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2B4C9B]"><Zap className="h-4 w-4" /></span>
              <h2 className="text-sm font-bold">Signaler un incident</h2>
              <p className="my-1.5 text-[11px] leading-snug text-gray-500 dark:text-gray-300">Une coupure, un câble dangereux ou un poteau endommagé ? Impliquez-vous.</p>
              <Link to="/nouveau-signalement" className="yellow-flash group mt-2 flex w-full items-center justify-between rounded-xl px-4 py-2 font-bold">Faire un signalement <ChevronRight className="flash-arrow h-5 w-5" /></Link>
            </section>

            <section className="citizen-card mb-3 rounded-3xl border border-white/90 bg-white/95 p-4 text-[#1B1F3B] shadow-md shadow-slate-200/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#1B1F3B]/95 dark:text-white dark:shadow-none">
              <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[#2B4C9B]"><ClipboardList className="h-4 w-4" /></span>
              <h2 className="text-sm font-bold">Suivre mes signalements</h2>
              <p className="my-1.5 text-[11px] leading-snug text-gray-500 dark:text-gray-300">Retrouvez vos démarches et leur avancement.</p>
              <Link to="/mes-signalements" className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2 text-center text-xs font-semibold text-[#1B1F3B] transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/5">Voir mes suivis →</Link>
            </section>
            <LatestReport report={latestReport} loading={loading} />
          </div>
          <CitizenBottomNav active="home" />
        </main>
      </div>

      <div className="citizen-desktop-home hidden h-full min-h-0 flex-col overflow-hidden bg-[#F7F6F0] text-[#1B1F3B] dark:bg-[#0E1226] dark:text-gray-100 md:flex">
        <CitizenDesktopHeader active="home" />
        <main className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 content-center grid-cols-1 gap-4 overflow-hidden px-8 py-5 md:grid-cols-2 lg:grid-cols-3">
          <section className="md:col-span-2 lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Votre espace citoyen</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Bonjour{prenom ? ` ${prenom}` : ''}.</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Ensemble, rendons notre quartier éclairé.</p>
          </section>
          <section className="citizen-card rounded-3xl border border-white/90 bg-white/95 p-5 text-[#1B1F3B] shadow-md shadow-slate-200/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#1B1F3B]/95 dark:text-white dark:shadow-none">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2B4C9B]"><Zap className="h-5 w-5" /></span>
            <h2 className="text-lg font-bold">Signaler un incident</h2>
            <p className="my-3 text-sm leading-relaxed text-gray-500 dark:text-gray-300">Une coupure, un câble dangereux ou un poteau endommagé ? Impliquez-vous.</p>
            <Link to="/nouveau-signalement" className="yellow-flash group mt-5 flex w-full items-center justify-between rounded-xl px-4 py-3.5 font-bold">Faire un signalement <ChevronRight className="flash-arrow h-5 w-5" /></Link>
          </section>
          <section className="citizen-card rounded-3xl border border-white/90 bg-white/95 p-5 text-[#1B1F3B] shadow-md shadow-slate-200/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#1B1F3B]/95 dark:text-white dark:shadow-none">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-[#2B4C9B]"><ClipboardList className="h-5 w-5" /></span>
            <h2 className="text-lg font-bold">Suivre mes signalements</h2>
            <p className="my-3 text-sm leading-relaxed text-gray-500 dark:text-gray-300">Retrouvez vos démarches et leur avancement.</p>
            <Link to="/mes-signalements" className="mt-5 block w-full rounded-xl border border-gray-200 px-4 py-3 text-center font-semibold text-[#1B1F3B] transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/5">Voir mes suivis →</Link>
          </section>
          <LatestReport report={latestReport} loading={loading} />
        </main>
      </div>
    </div>
  )
}
