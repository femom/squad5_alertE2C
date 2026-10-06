import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Zap } from 'lucide-react'
import { setAgentAuth } from '../lib/api.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function AgentHeader() {
  const navigate = useNavigate()
  function logout() {
    setAgentAuth(null)
    navigate('/agent/login', { replace: true })
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-[#1B1F3B]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-6">
        <Link to="/agent/incidents" className="flex items-center gap-3" aria-label="E2C Pro, accueil agent">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B1F3B] text-[#F5B942]"><Zap className="h-5 w-5" /></span>
          <span className="text-lg font-extrabold tracking-tight text-[#1B1F3B] dark:text-white">E2C<span className="text-[#F5B942]">.</span><span className="ml-2 text-xs font-bold uppercase tracking-widest text-[#2B4C9B] dark:text-blue-300">Pro</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-[#1B1F3B] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Déconnexion</span></button>
        </div>
      </div>
    </header>
  )
}
