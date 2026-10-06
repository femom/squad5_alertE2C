import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { AlertTriangle, ArrowRight, Cable, ClipboardCheck, Lightbulb, LoaderCircle, MapPin, ShieldAlert, Zap } from 'lucide-react'
import { api } from '../lib/api.js'
import { useReports } from '../contexts/ReportsContext.jsx'
import CitizenBottomNav from '../components/CitizenBottomNav.jsx'
import CitizenDesktopHeader from '../components/CitizenDesktopHeader.jsx'

const typesIncident = [
  { nom: 'Coupure', Icon: Zap },
  { nom: 'Câble', Icon: Cable },
  { nom: 'Éclairage', Icon: Lightbulb },
  { nom: 'Autre', Icon: AlertTriangle }
]

export default function NewReport() {
  const navigate = useNavigate()
  const { addReport } = useReports()
  const [type, setType] = useState('Coupure')
  const [description, setDescription] = useState('')
  const [adresse, setAdresse] = useState('')
  const [position, setPosition] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [apercu, setApercu] = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [localisation, setLocalisation] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('alert-e2c-token')) navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    if (!photo) {
      setApercu('')
      return undefined
    }
    const url = URL.createObjectURL(photo)
    setApercu(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  function utiliserPosition() {
    if (!navigator.geolocation) {
      setErreur('La géolocalisation n’est pas disponible sur cet appareil.')
      return
    }
    setLocalisation(true)
    setErreur('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ latitude: coords.latitude, longitude: coords.longitude })
        setLocalisation(false)
      },
      () => {
        setErreur('Position inaccessible. Saisissez votre adresse manuellement.')
        setLocalisation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function onSubmit(event) {
    event.preventDefault()
    setErreur('')
    const token = localStorage.getItem('alert-e2c-token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    if (!photo) {
      setErreur('Ajoutez une photo de l’incident pour envoyer le signalement.')
      return
    }
    if (position && !adresse.trim()) {
      setErreur('Ajoutez une rue ou un quartier pour décrire le lieu du signalement.')
      return
    }

    const formData = new FormData()
    formData.append('type', type)
    formData.append('description', description.trim())
    formData.append('adresse', adresse.trim())
    if (position) {
      formData.append('latitude', String(position.latitude))
      formData.append('longitude', String(position.longitude))
    }
    formData.append('photo', photo)

    setChargement(true)
    try {
      const { data } = await api.post('/reports', formData, { headers: { Authorization: `Bearer ${token}` } })
      addReport(data)
      navigate('/mes-signalements', { replace: true })
    } catch (requestError) {
      setErreur(requestError.response?.data?.error || 'Le signalement n’a pas pu être envoyé. Réessayez.')
    } finally {
      setChargement(false)
    }
  }

  const mapQuery = position ? `${position.latitude},${position.longitude}` : adresse.trim()
  const mapUrl = mapQuery ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed` : ''

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#1B1F3B] dark:bg-[#0E1226] dark:text-gray-100">
      <div className="block md:hidden">
        <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6">
          <Link to="/accueil" aria-label="Retour à l'accueil citoyen" className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-2xl leading-none dark:border-white/10 dark:bg-white/5 dark:text-white">‹</Link>
          <h1 className="text-base font-bold">Nouveau signalement</h1>
          <span className="h-10 w-10" aria-hidden="true" />
        </header>
      </div>
      <div className="hidden md:block"><CitizenDesktopHeader active="new" /></div>

      <main className="mx-auto w-full max-w-md px-5 pb-24 pt-5 md:max-w-6xl md:px-8 md:py-8">
        <div className="mb-6 md:hidden"><p className="text-sm text-gray-500">Décrivez l’incident pour permettre à nos équipes d’intervenir.</p></div>
        <div className="mb-7 hidden md:block"><p className="text-xs font-bold uppercase tracking-wider text-gray-400">Votre espace citoyen</p><h1 className="mt-1 text-3xl font-extrabold">Signaler un incident</h1><p className="mt-2 text-sm text-gray-500">Décrivez l’incident pour permettre à nos équipes d’intervenir.</p></div>

        <aside role="note" className="e2c-card mb-6 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-amber-950 dark:border-amber-300/15 dark:bg-amber-950/25 dark:text-amber-100">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-300/10 dark:text-[#F5B942]"><ShieldAlert className="h-5 w-5" aria-hidden="true" /></span>
          <div><h2 className="text-sm font-bold">Merci d’être sincère dans votre signalement</h2><p className="mt-1 text-xs leading-relaxed text-amber-900/80 dark:text-amber-100/75">Les fausses déclarations volontaires peuvent entraîner des sanctions prévues par la loi, y compris une amende. Vérifiez les informations avant d’envoyer votre signalement.</p></div>
        </aside>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <form onSubmit={onSubmit} className="space-y-5 md:col-span-2 md:rounded-3xl md:border md:border-white/90 md:bg-white/80 md:p-6 md:text-[#1B1F3B] md:shadow-xl md:shadow-slate-200/50 md:backdrop-blur-xl dark:md:border-white/10 dark:md:bg-[#1B1F3B]/80 dark:md:text-white dark:md:shadow-none">
            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Type d’incident</legend>
              <div className="grid grid-cols-2 gap-3">
                {typesIncident.map((option, index) => (
                  <m.label key={option.nom} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.05 }} className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${type === option.nom ? 'border-[#2B4C9B] bg-blue-50/70 font-bold text-[#1B1F3B] ring-2 ring-[#2B4C9B]/20 dark:bg-blue-950/40 dark:text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-white/10 dark:bg-[#1B1F3B]/60 dark:text-gray-300 dark:hover:border-white/20'}`}>
                    <input type="radio" name="type" value={option.nom} checked={type === option.nom} onChange={() => setType(option.nom)} className="sr-only" />
                    <option.Icon className="h-6 w-6 text-[#2B4C9B]" aria-hidden="true" />
                    <span className="text-sm">{option.nom}</span>
                  </m.label>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm font-semibold" htmlFor="description">Description
              <textarea id="description" required minLength={10} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Décrivez ce que vous avez constaté…" className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:border-[#2B4C9B] focus:outline-none dark:border-white/10 dark:bg-[#222A4A] dark:text-white dark:placeholder:text-gray-400" />
            </label>

            <div>
              <label className="block text-sm font-semibold" htmlFor="adresse">Localisation / adresse</label>
              <div className="mt-2 flex gap-2">
                <input id="adresse" required value={adresse} onChange={(event) => setAdresse(event.target.value)} placeholder="Avenue, rue, quartier…" className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:border-[#2B4C9B] focus:outline-none dark:border-white/10 dark:bg-[#222A4A] dark:text-white dark:placeholder:text-gray-400" />
                <button type="button" onClick={utiliserPosition} disabled={localisation} className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-[#2B4C9B] disabled:opacity-60 dark:border-white/10 dark:bg-[#222A4A] dark:text-blue-100">{localisation ? 'Position…' : 'Ma position'}</button>
              </div>
              {position && <p className="mt-2 text-xs text-green-700 dark:text-green-300">Position GPS enregistrée. Saisissez aussi une rue ou un quartier pour aider les équipes à vous trouver.</p>}
              {mapUrl && mapQuery.length >= 4 && <section className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#222A4A]" aria-label="Aperçu de la localisation">
                <div className="flex items-center justify-between gap-3 px-3 py-2"><p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Aperçu Google Maps</p><a className="text-xs font-semibold text-[#2B4C9B] underline dark:text-blue-300" href={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer">Ouvrir dans Maps</a></div>
                <iframe title="Aperçu Google Maps du lieu du signalement" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block aspect-[16/9] w-full border-0" />
              </section>}
            </div>

            <div>
              <label htmlFor="photo" className="block text-sm font-semibold">Photo de l’incident</label>
              <input id="photo" type="file" accept="image/*" required onChange={(event) => setPhoto(event.target.files?.[0] || null)} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white p-2 text-xs text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#2B4C9B] dark:border-white/10 dark:bg-[#222A4A] dark:text-white" />
              {apercu && <img src={apercu} alt="Aperçu de la photo du signalement" className="mt-3 max-h-56 w-full rounded-xl border border-gray-100 object-cover dark:border-white/10" />}
            </div>

            {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{erreur}</p>}

            <button type="submit" disabled={chargement} className="yellow-flash group flex w-full items-center justify-between rounded-xl px-4 py-3.5 font-bold disabled:cursor-wait disabled:opacity-60">
              <span className="flex items-center gap-2">{chargement && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{chargement ? 'Envoi du signalement…' : 'Envoyer le signalement'}</span><span aria-hidden="true" className="flash-arrow">→</span>
            </button>
          </form>

          <aside className="hidden h-fit self-start space-y-4 lg:block">
            <section className="e2c-card rounded-3xl border border-white/90 bg-white/80 p-6 text-[#1B1F3B] shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white dark:shadow-none">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2B4C9B]"><MapPin className="h-5 w-5" /></div>
              <h2 className="font-bold">Quelques conseils</h2>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-gray-500 dark:text-gray-300">
                <li>Décrivez précisément le problème observé.</li>
                <li>Indiquez une adresse ou un repère facile à trouver.</li>
                <li>Ajoutez une photo nette prise à distance de sécurité.</li>
              </ul>
            </section>
            <section className="e2c-card rounded-3xl border border-white/90 bg-white/80 p-6 text-[#1B1F3B] shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/80 dark:text-white dark:shadow-none">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-[#1B1F3B] dark:bg-amber-300/10 dark:text-[#F5B942]"><ClipboardCheck className="h-5 w-5" /></div>
              <h2 className="font-bold">Après l’envoi</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-300">Retrouvez votre signalement et consultez l’évolution de son statut depuis votre espace.</p>
              <Link to="/mes-signalements" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#2B4C9B] hover:underline dark:text-[#F5B942]">Mes signalements <ArrowRight className="h-4 w-4" /></Link>
            </section>
          </aside>
        </div>
      </main>
      <CitizenBottomNav active="new" />
    </div>
  )
}
