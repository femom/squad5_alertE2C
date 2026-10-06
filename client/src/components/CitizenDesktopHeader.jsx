import { Link, useNavigate } from 'react-router-dom'
import { LogOut, PlusCircle, Zap } from 'lucide-react'
import { getAuthUser, setAuthToken, setAuthUser } from '../lib/api.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function CitizenDesktopHeader({ active }) {
  const navigate = useNavigate()
  const user = getAuthUser()
  const name = user?.nom || user?.nomComplet || ''
  const firstName = name.trim().split(/\s+/)[0] || ''

  function logout() {
    setAuthToken(null)
    setAuthUser(null)
    navigate('/login', { replace: true })
  }

  const navClass = (item) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${active === item ? 'bg-blue-50 text-[#2B4C9B] dark:bg-white/10 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1B1F3B] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'}`

  return (
    <header className="hidden w-full items-center justify-between border-b border-gray-200/70 bg-[#F7F6F0]/90 px-8 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#0E1226]/95 md:flex">
      <Link to="/accueil" aria-label="Accueil E2C" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B1F3B] text-white" aria-hidden="true"><Zap className="h-5 w-5" /></span>
        <span className="text-xl font-extrabold tracking-tight text-[#1B1F3B] dark:text-white">E2C<span className="text-[#F5B942]">.</span></span>
      </Link>
      <nav aria-label="Navigation principale" className="flex items-center gap-2">
        <Link to="/accueil" className={navClass('home')}>Accueil</Link>
        <Link to="/mes-signalements" className={navClass('reports')}>Mes signalements</Link>
        <Link to="/nouveau-signalement" className={navClass('new')}><PlusCircle className="h-4 w-4" />Nouveau signalement</Link>
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle compact />
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5B942] font-bold text-[#1B1F3B]" aria-label={firstName ? `Profil de ${name}` : 'Profil utilisateur'}>{firstName.charAt(0).toUpperCase()}</span>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-red-600 dark:text-gray-300"><LogOut className="h-4 w-4" />Déconnexion</button>
      </div>
    </header>
  )
}
