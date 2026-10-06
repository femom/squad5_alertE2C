# ALERT E2C

Signalement et suivi des dysfonctionnements électriques — Squad 5, Akieni Academy, Évaluation 2.

MVP (3 jours) : 2 rôles — Citoyen et Agent E2C. Statuts : Nouveau → En cours → Résolu.

## Structure

```
alert-e2c/
├── client/   → React + Vite + Tailwind CSS
└── server/   → Node.js + Express
```

## Démarrage

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
API disponible sur http://localhost:4000

### Frontend
```bash
cd client
npm install
npm run dev
```
App disponible sur http://localhost:5173


## Palette (logo E2C)

| Couleur | Hex |
|---|---|
| Bleu marine | `#1B1E4B` |
| Bleu | `#2C3E8C` |
| Jaune | `#F5B942` |
| Orange | `#E8482E` |
| Vert (statut résolu) | `#1F9D55` |

## Découpage MVP (16 User Stories, 4 Epics)

- **AE-1** — Accès et authentification (US-01 à US-03)
- **AE-2** — Signalement citoyen (US-04 à US-10)
- **AE-3** — Suivi citoyen (US-11 à US-13)
- **AE-4** — Traitement Agent E2C (US-14 à US-16)

Voir le dossier BA pour le détail des User Stories, règles métier et critères d'acceptation.
