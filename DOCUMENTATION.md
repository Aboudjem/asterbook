# Documentation Complète - Asterbook

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Architecture technique](#2-architecture-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Installation et configuration](#4-installation-et-configuration)
5. [Développement local](#5-développement-local)
6. [Base de données](#6-base-de-données)
7. [Authentification](#7-authentification)
8. [Fonctionnalités principales](#8-fonctionnalités-principales)
9. [Tests](#9-tests)
10. [Déploiement](#10-déploiement)
11. [Variables d'environnement](#11-variables-denvironnement)
12. [Dépannage](#12-dépannage)

---

## 1. Vue d'ensemble du projet

### Qu'est-ce qu'Asterbook ?

Asterbook est une plateforme Web3 Gaming/DeFi construite autour de l'écosystème ASTER. C'est un "gateway" (portail) qui permet aux utilisateurs d'explorer :

- **DeFi** : Finance décentralisée (staking, lending, swaps)
- **Gaming** : Jeux intégrés (Pet Arena, Pet Adventure, Aster Jump, Perp Clash)
- **NFT Marketplace** : Achat/vente de NFTs
- **Whale Radar** : Suivi des grandes transactions blockchain en temps réel
- **Intelligence AI** : Outils d'analyse de marché alimentés par l'IA
- **Bridge** : Transfert de tokens entre blockchains

### Public cible

- Utilisateurs de cryptomonnaies
- Joueurs Web3
- Investisseurs DeFi
- Développeurs (via le Dev Hub)

---

## 2. Architecture technique

### Stack technologique

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  Next.js 14 (App Router) + React 18 + TypeScript       │
│  Tailwind CSS + Bootstrap 5 + Custom CSS               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                           │
│  NestJS + TypeScript + Prisma ORM                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     BASE DE DONNÉES                     │
│  PostgreSQL (via Prisma)                               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICES EXTERNES                     │
│  - BSC RPC Nodes (Binance Smart Chain)                 │
│  - DexScreener API (prix des tokens)                   │
│  - Asterdex FAPI (données du projet)                   │
│  - BSCScan API (données blockchain)                    │
└─────────────────────────────────────────────────────────┘
```

### Technologies utilisées

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Frontend | Next.js | 14.2.0 |
| Framework JS | React | 18.x |
| Langage | TypeScript | 5.x |
| Styling | Tailwind CSS + Bootstrap 5 | - |
| Backend | NestJS | 10.x |
| ORM | Prisma | 5.22.0 |
| BDD | PostgreSQL | 15+ |
| Package Manager | pnpm | 8.x |
| Monorepo | Turborepo | - |

---

## 3. Structure du projet

```
asterbook/
├── apps/
│   ├── web/                    # Application frontend Next.js
│   │   ├── src/
│   │   │   ├── app/           # Pages (App Router)
│   │   │   │   ├── dashboard/ # Page tableau de bord
│   │   │   │   ├── defi/      # Page DeFi
│   │   │   │   ├── gaming/    # Page Gaming
│   │   │   │   ├── staking/   # Page Staking
│   │   │   │   ├── lending/   # Page Lending
│   │   │   │   ├── marketplace/ # NFT Marketplace
│   │   │   │   ├── whale-radar/ # Suivi des baleines
│   │   │   │   ├── intelligence/ # Outils AI
│   │   │   │   ├── bridge/    # Bridge cross-chain
│   │   │   │   ├── arena/     # Pet Arena (jeu)
│   │   │   │   ├── pet-adventure/ # Pet Adventure (jeu)
│   │   │   │   ├── aster-jump/ # Aster Jump (jeu)
│   │   │   │   ├── clash/     # Perp Clash (jeu)
│   │   │   │   ├── auth/      # Authentification
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── profile/   # Profil utilisateur
│   │   │   │   ├── shop/      # Boutique
│   │   │   │   ├── payment/   # Paiement premium
│   │   │   │   └── ...
│   │   │   ├── components/    # Composants React réutilisables
│   │   │   │   └── layout/    # Header, Sidebar, Footer
│   │   │   ├── styles/        # CSS spécifiques aux pages
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── stores/        # State management (Zustand)
│   │   │   └── lib/           # Utilitaires
│   │   ├── public/
│   │   │   └── assets/        # Fichiers statiques
│   │   │       ├── css/       # Stylesheets
│   │   │       ├── fonts/     # Polices d'icônes
│   │   │       ├── images/    # Images
│   │   │       └── js/        # Scripts (Bootstrap)
│   │   └── package.json
│   │
│   └── api/                    # Backend NestJS
│       ├── src/
│       │   ├── modules/       # Modules métier
│       │   │   ├── auth/      # Authentification
│       │   │   ├── user/      # Gestion utilisateurs
│       │   │   ├── staking/   # Logique staking
│       │   │   ├── chat/      # Messagerie
│       │   │   └── ...
│       │   ├── prisma/        # Configuration Prisma
│       │   └── main.ts        # Point d'entrée
│       ├── prisma/
│       │   └── schema.prisma  # Schéma base de données
│       └── package.json
│
├── packages/                   # Packages partagés
│   └── config/                # Configurations partagées
│
├── turbo.json                 # Configuration Turborepo
├── pnpm-workspace.yaml        # Configuration pnpm workspace
└── package.json               # Package racine
```

---

## 4. Installation et configuration

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 18 ou supérieure)
   ```bash
   # Vérifier la version
   node --version  # Doit afficher v18.x.x ou plus
   ```

2. **pnpm** (gestionnaire de packages)
   ```bash
   # Installer pnpm globalement
   npm install -g pnpm

   # Vérifier l'installation
   pnpm --version
   ```

3. **PostgreSQL** (base de données)
   ```bash
   # macOS avec Homebrew
   brew install postgresql@15
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/asterbook.git
cd asterbook

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
# Copier les fichiers .env.example vers .env
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# 4. Configurer la base de données (voir section 6)

# 5. Générer le client Prisma
cd apps/api
pnpm prisma generate

# 6. Exécuter les migrations
pnpm prisma migrate dev

# 7. Retourner à la racine et lancer le projet
cd ../..
pnpm run dev
```

---

## 5. Développement local

### Commandes principales

```bash
# Démarrer tous les services en mode développement
pnpm run dev

# Démarrer uniquement le frontend
pnpm run dev --filter=@asterbook/web

# Démarrer uniquement le backend
pnpm run dev --filter=@asterbook/api

# Build de production
pnpm run build

# Linting
pnpm run lint

# Tests
pnpm run test
```

### Ports par défaut

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Backend (NestJS) | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | - |

### Hot Reload

Le projet supporte le hot reload :
- **Frontend** : Les modifications de code sont reflétées instantanément
- **Backend** : NestJS redémarre automatiquement lors des changements

---

## 6. Base de données

### Configuration PostgreSQL

```bash
# Créer la base de données
createdb asterbook

# Ou via psql
psql -U postgres
CREATE DATABASE asterbook;
\q
```

### Configuration Prisma

Le fichier `apps/api/prisma/schema.prisma` définit le schéma :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  username      String    @unique
  password      String
  walletAddress String?
  isPremium     Boolean   @default(false)
  stardust      Int       @default(0)
  createdAt     DateTime  @default(now())
  // ... autres champs
}

// ... autres modèles
```

### Commandes Prisma utiles

```bash
cd apps/api

# Générer le client Prisma après modification du schéma
pnpm prisma generate

# Créer une migration
pnpm prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
pnpm prisma migrate deploy

# Ouvrir Prisma Studio (interface visuelle)
pnpm prisma studio

# Réinitialiser la base de données (ATTENTION: efface toutes les données)
pnpm prisma migrate reset
```

---

## 7. Authentification

### Système d'authentification

Le projet utilise un système d'authentification basé sur :
- **JWT** (JSON Web Tokens) pour les sessions
- **bcrypt** pour le hachage des mots de passe

### Flux d'authentification

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   API    │────▶│   BDD    │
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     │  1. Login      │                │
     │  (email/pass)  │                │
     │───────────────▶│                │
     │                │  2. Vérifier   │
     │                │───────────────▶│
     │                │                │
     │                │  3. User data  │
     │                │◀───────────────│
     │                │                │
     │  4. JWT Token  │                │
     │◀───────────────│                │
     │                │                │
     │  5. Requêtes   │                │
     │  avec Token    │                │
     │───────────────▶│                │
```

### Pages d'authentification

- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/change-password` - Changement de mot de passe

---

## 8. Fonctionnalités principales

### 8.1 Dashboard (Tableau de bord)

Page principale après connexion. Affiche :
- Solde Stardust (monnaie interne)
- Pet virtuel avec système de faim
- Quêtes quotidiennes
- Terminal d'activité blockchain
- Rang utilisateur

### 8.2 DeFi

- **Staking** : Verrouiller des tokens ASTER pour gagner des récompenses
- **Lending** : Prêter/emprunter des cryptos avec intérêts
- **Buy ASTER** : Acheter des tokens via DEX intégrés

### 8.3 Gaming

- **Pet Arena** : Combats entre pets virtuels
- **Pet Adventure** : Exploration et quêtes
- **Aster Jump** : Jeu d'arcade intégré
- **Perp Clash** : Batailles de trading perpétuel

### 8.4 Whale Radar (Premium)

Suivi en temps réel des grandes transactions blockchain :
- Détection automatique des "whales" (gros portefeuilles)
- Alertes en temps réel
- Analyse AI des mouvements

### 8.5 Intelligence (Premium)

Outils d'analyse alimentés par l'IA :
- Analyse de sentiment
- Prédiction de prix
- Signaux de trading
- Suivi de news

### 8.6 Premium

Fonctionnalités premium à $2.47/mois :
- Accès Whale Radar
- Outils Intelligence
- Analyse avancée
- Support prioritaire

---

## 9. Tests

### Structure des tests

```
apps/
├── web/
│   └── __tests__/        # Tests frontend
│       ├── components/   # Tests composants
│       └── pages/        # Tests pages
└── api/
    └── src/
        └── __tests__/    # Tests backend
            ├── unit/     # Tests unitaires
            └── e2e/      # Tests end-to-end
```

### Exécution des tests

```bash
# Tous les tests
pnpm run test

# Tests frontend uniquement
pnpm run test --filter=@asterbook/web

# Tests backend uniquement
pnpm run test --filter=@asterbook/api

# Tests avec couverture
pnpm run test:coverage

# Tests en mode watch
pnpm run test:watch
```

### Écrire un test (exemple)

```typescript
// apps/web/__tests__/components/Sidebar.test.tsx
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/sidebar';

describe('Sidebar', () => {
  it('renders navigation items', () => {
    render(<Sidebar isPremium={false} />);
    expect(screen.getByText('Index')).toBeInTheDocument();
    expect(screen.getByText('DeFi')).toBeInTheDocument();
  });

  it('shows premium items when isPremium is true', () => {
    render(<Sidebar isPremium={true} />);
    expect(screen.getByText('Live Whale Radar')).toBeInTheDocument();
  });
});
```

---

## 10. Déploiement

### Option 1 : Vercel (Recommandé pour le frontend)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
cd apps/web
vercel

# Suivre les instructions interactives
```

### Option 2 : Docker

```dockerfile
# Dockerfile pour le frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build --filter=@asterbook/web

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build et run
docker build -t asterbook-web .
docker run -p 3000:3000 asterbook-web
```

### Option 3 : VPS (DigitalOcean, AWS EC2, etc.)

```bash
# Sur le serveur
# 1. Installer Node.js et pnpm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pnpm

# 2. Installer PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# 3. Configurer la base de données
sudo -u postgres psql
CREATE DATABASE asterbook;
CREATE USER asterbook_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE asterbook TO asterbook_user;
\q

# 4. Cloner et configurer
git clone https://github.com/votre-username/asterbook.git
cd asterbook
pnpm install

# 5. Configurer .env avec les bonnes valeurs

# 6. Build
pnpm run build

# 7. Démarrer avec PM2
npm install -g pm2
pm2 start pnpm --name "asterbook" -- run start
pm2 save
pm2 startup
```

### Configuration Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

---

## 11. Variables d'environnement

### Frontend (apps/web/.env)

```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# URL du site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Clés API externes (optionnel)
NEXT_PUBLIC_DEXSCREENER_API=https://api.dexscreener.com
NEXT_PUBLIC_BSCSCAN_API_KEY=votre_cle_bscscan
```

### Backend (apps/api/.env)

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/asterbook?schema=public"

# JWT
JWT_SECRET="votre_secret_jwt_tres_long_et_securise"
JWT_EXPIRATION="7d"

# Port
PORT=3001

# Environnement
NODE_ENV=development
```

---

## 12. Dépannage

### Problèmes courants

#### "Module not found" après installation

```bash
# Nettoyer et réinstaller
rm -rf node_modules
rm -rf apps/*/node_modules
pnpm install
```

#### Erreur Prisma "Client not generated"

```bash
cd apps/api
pnpm prisma generate
```

#### Port déjà utilisé

```bash
# Trouver le processus
lsof -i :3000

# Le tuer
kill -9 <PID>
```

#### Erreur de connexion à PostgreSQL

```bash
# Vérifier que PostgreSQL tourne
pg_isready

# Redémarrer PostgreSQL
# macOS
brew services restart postgresql

# Linux
sudo systemctl restart postgresql
```

#### Build qui échoue

```bash
# Nettoyer les caches
pnpm run clean
rm -rf .next
rm -rf apps/web/.next
pnpm run build
```

### Logs utiles

```bash
# Logs Next.js (frontend)
# Les erreurs apparaissent dans le terminal où `pnpm run dev` tourne

# Logs NestJS (backend)
# Même chose, dans le terminal

# Logs PostgreSQL
# macOS
tail -f /usr/local/var/log/postgresql@15.log

# Linux
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

---

## Ressources supplémentaires

### Documentation officielle

- [Next.js](https://nextjs.org/docs)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0)

### APIs utilisées

- [DexScreener API](https://docs.dexscreener.com/)
- [BSCScan API](https://docs.bscscan.com/)
- [Binance Smart Chain RPC](https://docs.bnbchain.org/docs/rpc)

---

## Contribution

Pour contribuer au projet :

1. Forker le repository
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commiter les changements (`git commit -m 'Add: ma feature'`)
4. Pusher (`git push origin feature/ma-feature`)
5. Créer une Pull Request

---

## Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe via Discord

---

*Documentation générée pour Asterbook v2.31.8*
