import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap } from 'lucide-react'
import { loginAgent, setAgentAuth } from '../lib/api.js'
import AgentBrandPanel from '../components/AgentBrandPanel.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function AgentLogin() {
  const navigate = useNavigate();
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    try {
      const { token, user } = await loginAgent({ telephone, motDePasse })
      setAgentAuth(token, user)
      navigate('/agent/incidents', { replace: true })
    } catch (err) {
      setErreur(err.response?.data?.error || 'Connexion impossible')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="auth-split grid min-h-screen w-full grid-cols-1 overflow-hidden md:grid-cols-2">
      <section className="agent-auth-pane flex min-h-0 h-full w-full flex-col justify-center px-4 py-4 md:px-8 lg:px-16">
        <main className="agent-login-card mx-auto w-full max-w-lg rounded-3xl border border-white/80 bg-white/60 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#1B1F3B]/70 dark:shadow-none">
          <div className="mb-3 flex justify-end"><ThemeToggle compact /></div>
          <Link to="/" aria-label="Accueil E2C" className="mb-4 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#1B1F3B] dark:text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B1F3B] text-[#F5B942]"><Zap className="h-5 w-5" /></span>
            <span>E2C<span className="text-[#F5B942]">.</span></span>
          </Link>
          <form onSubmit={onSubmit}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#F5B942]">Accès professionnel</p>
            <h1 className="mb-2 text-2xl font-bold text-[#1B1F3B] dark:text-white">Espace Agent</h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Connectez-vous pour gérer les signalements de votre secteur.</p>

            <label htmlFor="agent-phone" className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">Numéro de téléphone</label>
            <input id="agent-phone" type="tel" autoComplete="username" placeholder="06 000 00 00" required value={telephone} onChange={(e) => setTelephone(e.target.value)} className="mb-4 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2B4C9B] dark:border-white/10 dark:bg-[#222A4A] dark:text-white dark:placeholder:text-gray-400" />

            <label htmlFor="agent-password" className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">Mot de passe agent</label>
            <div className="relative mb-4">
              <input id="agent-password" type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" placeholder="Votre mot de passe agent" required value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2B4C9B] dark:border-white/10 dark:bg-[#222A4A] dark:text-white dark:placeholder:text-gray-400" />
              <button type="button" aria-label={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={passwordVisible} onClick={() => setPasswordVisible((visible) => !visible)} className="absolute inset-y-0 right-3 z-10 inline-flex cursor-pointer items-center justify-center bg-transparent p-1 text-gray-500 hover:text-[#2B4C9B] dark:text-gray-300" style={{ pointerEvents: 'auto' }}>{passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
            </div>

            {erreur && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-300/20 dark:bg-red-500/10 dark:text-red-200">{erreur}</p>}
            <button type="submit" disabled={chargement} className="yellow-flash w-full rounded-xl px-4 py-3 font-bold disabled:opacity-60">{chargement ? 'Connexion…' : 'Se connecter'}</button>
            <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300"><Link to="/login" className="font-semibold text-[#2B4C9B] underline underline-offset-4 dark:text-[#F5B942]">Accès citoyen</Link></p>
          </form>
        </main>
      </section>
      <AgentBrandPanel />
    </div>
  );
}
