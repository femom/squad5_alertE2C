# ⚡ ALERT E2C

Application web de **signalement et de suivi des dysfonctionnements électriques** (coupures, câbles endommagés, poteaux défectueux) pour E2C — Énergie Électrique du Congo.

Projet de la **Squad 5**, Akieni Academy — Cohorte 2, Évaluation 2 « Sprint Produit en Squad ».

🌐 **Site en ligne : [https://squad5-alert-e2-c.vercel.app/](https://squad5-alert-e2-c.vercel.app/)**

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités du MVP](#fonctionnalités-du-mvp)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation et démarrage](#installation-et-démarrage)
- [Variables d'environnement](#variables-denvironnement)
- [Déploiement](#déploiement)
- [Découpage du MVP](#découpage-du-mvp)
- [Hors périmètre (V2)](#hors-périmètre-v2)
- [Workflow Git](#workflow-git)
- [Charte graphique](#charte-graphique)

---

## Présentation

Aujourd'hui, un citoyen qui constate une panne ou un équipement dangereux n'a pas de moyen simple de le signaler ni de savoir ce qu'il devient. ALERT E2C permet :

- au **citoyen** de signaler un incident (type, description, photo, adresse) et de suivre son traitement grâce à une référence unique ;
- à l'**Agent E2C** de consulter tous les signalements et de mettre à jour leur statut.

Le MVP a été conçu et livré en **3 jours** par une équipe de développeurs fullstack, à partir du cadrage du PM et du dossier BA.

## Fonctionnalités du MVP

**Deux rôles** : Citoyen et Agent E2C. Les statuts d'un signalement suivent un seul sens : **Nouveau → En cours → Résolu**.

### Côté citoyen
- Créer un compte et se connecter
- Créer un signalement : type, description, **photo obligatoire**, **adresse textuelle obligatoire**
- Recevoir une **référence unique** après un signalement validé
- Consulter la liste de **ses** signalements et leur statut (uniquement les siens)

### Côté Agent E2C
- Se connecter via un accès dédié
- Consulter la liste globale de tous les signalements
- Ouvrir le détail d'un signalement
- Changer son statut ; le nouveau statut est visible immédiatement côté citoyen

### Règles métier clés
- Un citoyen non authentifié n'accède pas à son espace
- Un champ obligatoire manquant (type, description, photo, adresse) bloque la soumission
- La référence unique n'est générée que si la validation réussit
- Le statut initial d'un signalement est toujours « Nouveau »
- Un citoyen ne voit que ses propres signalements ; seul l'Agent E2C accède à la liste globale
- En cas d'échec d'enregistrement, aucune référence de succès n'est affichée

### Bonus
- Application **installable (PWA)** : bouton « Télécharger l'application » (non supporté sur Safari/iOS)
- **Mode clair / sombre**
- Interface responsive

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Authentification | JWT |
| Stockage | Fichier `db.json` (MVP) |
| Déploiement | Vercel (frontend), Render (backend) |

## Structure du projet

```
squad5_alertE2C/
├── client/   → React + Vite + Tailwind CSS
└── server/   → Node.js + Express
```

## Installation et démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (version LTS recommandée) et npm
- Git

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd <dossier-du-depot>
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

L'API est disponible sur http://localhost:4000

### 3. Frontend

Dans un second terminal :

```bash
cd client
npm install
npm run dev
```

L'application est disponible sur http://localhost:5173

## Variables d'environnement

Le fichier `server/.env.example` sert de modèle. Un **compte Agent E2C de démonstration** est créé automatiquement au démarrage du serveur à partir des variables suivantes :

| Variable | Rôle |
|---|---|
| `E2C_AGENT_NAME` | Nom de l'agent de démonstration |
| `E2C_AGENT_PHONE` | Téléphone de l'agent (identifiant de connexion) |
| `E2C_AGENT_PASSWORD` | Mot de passe de l'agent |

> Ne jamais commiter le fichier `.env`.

## Déploiement

- **Frontend** : Vercel → https://squad5-alert-e2-c.vercel.app/
- **Backend** : Render (mêmes variables d'environnement à définir dans le tableau de bord)

## Découpage du MVP

16 User Stories réparties en 4 Epics, toutes en priorité *Must* :

| Epic | Intitulé | User Stories |
|---|---|---|
| **AE-1** | Accès et authentification | US-01 à US-03 |
| **AE-2** | Signalement citoyen | US-04 à US-10 |
| **AE-3** | Suivi citoyen | US-11 à US-13 |
| **AE-4** | Traitement Agent E2C | US-14 à US-16 |

Le détail des User Stories, des règles métier et des critères d'acceptation se trouve dans le dossier BA.

## Hors périmètre (V2)

Profils Technicien, Superviseur et Administrateur, qualification et priorisation, affectation à une équipe, notifications, détection de doublons, cartographie et statistiques avancées.

## Workflow Git

- **`main`** : branche stable, utilisée pour la démo
- **`develop`** : branche d'intégration
- Aucun push direct sur `main` ni `develop` : tout passe par une **Pull Request**, en **squash merge**, avec au moins **1 review**
- Une branche par User Story, créée depuis `develop`, au format `type/AE-numéro-description-courte` (minuscules, sans accents) :
  - `feat/AE-5-inscription-citoyen`
  - `fix/...` depuis `develop`, `hotfix/...` depuis `main`
- Commits au format `type(AE-X): description courte`, par exemple `feat(AE-5): ajout de l'inscription citoyen`

## Charte graphique

Palette issue du logo E2C :

| Couleur | Hex | Usage |
|---|---|---|
| Bleu marine | `#1B1E4B` | Couleur principale |
| Bleu | `#2C3E8C` | Accents |
| Jaune | `#F5B942` | Éclair, mise en avant |
| Orange | `#E8482E` | Alertes |
| Vert | `#1F9D55` | Statut « Résolu » |

---

*Squad 5 — Akieni Academy, Cohorte 2.*