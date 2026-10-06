import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import { loginCitoyen, registerCitoyen, setAuthToken, setAuthUser } from "../lib/api.js";
import BrandPanel from "../components/BrandPanel.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Register() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
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
      await registerCitoyen({ nom, telephone, motDePasse });
      const { token, user } = await loginCitoyen({ telephone, motDePasse });
      setAuthToken(token);
      setAuthUser(user);
      navigate("/accueil");
    } catch (err) {
      setErreur(err.response?.data?.error || "Inscription impossible");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="auth-split h-screen w-full min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <section className="auth-pane w-full flex flex-col justify-center min-h-0 h-full p-4 md:px-8 lg:px-16">
        <div className="auth-card w-full max-w-lg mx-auto p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-200/50 dark:border-white/10">
        <div className="mb-3 flex justify-end"><ThemeToggle compact /></div>
        <Link to="/" className="inline-flex mb-7" aria-label="Accueil E2C">
          <span className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#1B1F3B] dark:text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1B1F3B] text-[#F5B942]"><Zap className="h-5 w-5" aria-hidden="true" /></span>
            <span>E2C<span className="text-[#F5B942]">.</span></span>
          </span>
        </Link>

        <main className="auth-form-stage">
        <form onSubmit={onSubmit} className="auth-form w-full">
          <div className="auth-user-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 19v-1.4a6.5 6.5 0 0 1 13 0V19z"/></svg>
          </div>
          <p className="text-xs font-semibold text-blue tracking-wide uppercase mb-2">
            Rejoignez E2C
          </p>
          <h1 className="text-xl font-bold text-navy mb-2">
            L'énergie nous rapproche.
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Créez votre espace pour nous signaler un incident.
          </p>

          <label className="block text-xs text-gray-500 mb-2">
            Nom complet
          </label>
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex. Amina Mbemba"
            className="auth-input w-full mb-4 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:bg-white"
          />

          <label className="block text-xs text-gray-500 mb-2">
            Numéro de téléphone
          </label>
          <div className="phone-field mb-4">
            <span className="phone-prefix">
              +242
            </span>
            <input
              type="tel"
              required
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="06 000 00 00"
              className="phone-input bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:bg-white"
            />
          </div>

          <label htmlFor="citizen-register-password" className="block text-xs text-gray-500 mb-2">
            Mot de passe
          </label>
          <div className="relative mb-4">
            <input id="citizen-register-password" type={passwordVisible ? "text" : "password"} required value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="Choisissez un mot de passe" className="auth-input w-full bg-white/80 pr-12 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:bg-white" />
            <button type="button" aria-label={passwordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={passwordVisible} onClick={() => setPasswordVisible((visible) => !visible)} className="absolute inset-y-0 right-3 z-10 inline-flex cursor-pointer items-center justify-center bg-transparent p-1 text-gray-500 hover:text-[#2B4C9B] dark:text-gray-300" style={{ pointerEvents: 'auto' }}>{passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>

          {erreur && <p className="text-sm text-orange mb-4">{erreur}</p>}

          <button
            type="submit"
            disabled={chargement}
            className="auth-submit yellow-flash w-full font-semibold disabled:opacity-60"
          >
            <span>{chargement ? "Création..." : "Créer mon compte"}</span>
            {!chargement && <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Déjà un compte ? <Link to="/login" className="font-semibold text-[#2B4C9B] underline dark:text-[#F5B942]">Se connecter</Link>
          </p>
        </form>
        </main>
        </div>
      </section>
      <BrandPanel />
    </div>
  );
}
