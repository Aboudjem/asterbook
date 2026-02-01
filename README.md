# 🌟 Asterbook

Plateforme Gaming/DeFi/Web3 - Jouez, gagnez et stakez avec votre animal virtuel.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- pnpm 9+
- MySQL 8+

### Installation

```bash
# Cloner le repo
git clone https://github.com/adamboudj/asterbook.git
cd asterbook

# Installer les dépendances
pnpm install

# Copier les fichiers d'environnement
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Configurer la base de données dans .env
# DATABASE_URL="mysql://user:password@localhost:3306/asterbook"

# Générer le client Prisma et appliquer les migrations
pnpm db:generate
pnpm db:push

# Lancer en développement
pnpm dev
```

### URLs

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **API Docs (Swagger)**: http://localhost:4000/api/docs

## 📁 Structure du Projet

```
asterbook/
├── apps/
│   ├── web/                    # Frontend Next.js 14+
│   │   ├── src/app/           # App Router pages
│   │   ├── src/components/    # Composants React
│   │   ├── src/hooks/         # Custom hooks
│   │   ├── src/lib/           # Utils, API client
│   │   └── src/store/         # Zustand stores
│   │
│   └── api/                    # Backend NestJS
│       ├── src/modules/       # Modules par fonctionnalité
│       │   ├── auth/          # Authentification
│       │   ├── users/         # Gestion utilisateurs
│       │   ├── pets/          # Système de pets
│       │   ├── arena/         # Combat PvE/PvP
│       │   ├── staking/       # Staking de Stardust
│       │   ├── shop/          # Boutique
│       │   ├── quests/        # Quêtes quotidiennes
│       │   ├── marketplace/   # Marketplace NFT
│       │   ├── chat/          # Chat temps réel
│       │   ├── developer/     # API développeur
│       │   ├── security/      # Système Sentinel
│       │   ├── admin/         # Administration
│       │   ├── blockchain/    # Intégration BSC
│       │   └── premium/       # Abonnement premium
│       └── src/common/        # Guards, decorators, filters
│
├── packages/
│   ├── database/              # Schema Prisma + client
│   ├── types/                 # Types TypeScript partagés
│   ├── utils/                 # Utilitaires partagés
│   ├── ui/                    # Composants UI partagés
│   ├── config/                # Configuration (game constants, chains)
│   └── eslint-config/         # Configuration ESLint
│
├── turbo.json                 # Configuration Turborepo
├── pnpm-workspace.yaml        # Configuration workspace pnpm
└── package.json               # Package racine
```

## ✨ Fonctionnalités

### 🐉 Système de Pet
- 3 stades d'évolution (Œuf → Bébé → Adulte)
- Système de faim avec déclin temporel
- Expéditions pour gagner des récompenses

### ⚔️ Arena
- **PvE**: Combattez contre l'IA avec probabilités basées sur les stats du pet
- **PvP**: Créez/rejoignez des lobbys pour des duels

### 💰 Économie
- **Stardust Coins**: Monnaie in-game
- **Staking**: Stakez vos coins pour des récompenses passives
- **Boutique**: Achetez des cosmétiques (bannières, bordures, effets)
- **Lootbox**: Capsules cosmiques avec récompenses aléatoires

### 📜 Quêtes
- 19 types de quêtes
- Renouvellement toutes les 6 heures
- 6 quêtes actives par batch

### 🛡️ Sécurité (Sentinel)
- Détection de vélocité anormale de gains
- Plafond de balance (anti-exploit)
- Gel automatique des comptes suspects

## 🔧 Scripts Disponibles

```bash
# Développement
pnpm dev                # Lancer tous les apps en dev
pnpm build              # Build de production

# Base de données
pnpm db:generate        # Générer le client Prisma
pnpm db:push            # Push le schema vers la DB
pnpm db:migrate         # Créer une migration

# Qualité du code
pnpm lint               # Linter
pnpm test               # Tests
```

## 🔐 Variables d'Environnement

### Backend (apps/api/.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion MySQL |
| `JWT_SECRET` | Clé secrète pour JWT |
| `JWT_EXPIRES_IN` | Durée de validité JWT (ex: "7d") |
| `PORT` | Port du serveur (default: 4000) |
| `FRONTEND_URL` | URL du frontend pour CORS |

### Frontend (apps/web/.env)

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | Clé secrète NextAuth |
| `NEXTAUTH_URL` | URL du frontend |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend |

## 📚 API Endpoints

```
/api/v1
├── /auth      - login, register, logout, change-password
├── /users     - me, leaderboard, profile
├── /pets      - get, feed, expedition
├── /arena     - pve/battle, pvp/lobbies
├── /staking   - stake, vaults, claim
├── /shop      - items, inventory, buy, equip
├── /quests    - list, track
├── /health    - status check
```

Documentation Swagger complète: http://localhost:4000/api/docs

## 🧪 Tests

```bash
# Tous les tests
pnpm test

# Tests avec couverture
pnpm test:cov

# Tests en mode watch
pnpm test:watch
```

## 🚀 Déploiement

### Vercel (Frontend)

1. Connectez le repo à Vercel
2. Configurez les variables d'environnement
3. Deploy automatique sur push vers main

### Backend

1. Build: `pnpm build --filter=@asterbook/api`
2. Start: `node apps/api/dist/main.js`

## 📝 License

MIT © Adam Boudj
