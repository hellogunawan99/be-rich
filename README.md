# 💰 BeRich - Personal Finance Management Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Modern. Secure. Beautiful.** A full-featured personal finance application built with the latest tech stack.

[🚀 Live Demo](#live-demo) • [✨ Features](#features) • [🐳 Quick Start](#quick-start) • [📖 Documentation](#documentation) • [🤝 Contributing](#contributing)

</div>

---

## ✨ Features

### 🎯 Core Features

- **📊 Dashboard** - Real-time overview with total balance, monthly income/expenses, and goal progress tracking
- **💒 Savings Accounts** - Create and manage multiple accounts with custom icons and colors
- **🎯 Goals Tracking** - Set financial goals with target amounts and deadlines
- **📈 Auto-Tracking** - Link goals to savings accounts for automatic progress updates
- **💳 Transactions** - Record income and expenses with automatic balance updates
- **🔐 Authentication** - Secure user authentication with NextAuth.js

### 🎨 Modern UI/UX

- **💎 Beautiful Design** - Modern interface with emerald and purple accent colors
- **📱 Mobile Responsive** - Fully responsive layout that works on all devices
- **⚡ Smooth Animations** - Polished micro-interactions and transitions
- **🌙 Light Theme** - Clean, easy-on-the-eyes light theme
- **🎯 Intuitive Navigation** - User-friendly sidebar and hamburger menu

### 🏗️ Technical Excellence

- **🔒 Security First** - Password hashing with bcrypt, environment-based secrets
- **🐳 Docker Ready** - Complete containerization with Docker Compose
- **📦 Standalone Build** - Optimized production build with Next.js
- **🗄️ Database** - PostgreSQL with Prisma ORM for type-safe queries
- **✅ Type Safety** - Full TypeScript coverage
- **🧪 Validation** - Zod schemas for API validation

---

## 🚀 Live Demo

**Coming Soon** - The application is currently in development.

---

## 🐳 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### Option 1: Docker (Recommended) 🐳

```bash
# Clone the repository
git clone https://github.com/hellogunawan99/be-rich.git
cd be-rich

# Start with Docker Compose
docker-compose up -d

# Access the app
open http://localhost:3010
```

### Option 2: Local Development 💻

```bash
# Clone the repository
git clone https://github.com/hellogunawan99/be-rich.git
cd be-rich

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Access the app
open http://localhost:3010
```

---

## 📖 Documentation

### Project Structure

```
be-rich/
├── 📂 prisma/                    # Database schema & migrations
├── 📂 src/
│   ├── 📂 app/                  # Next.js App Router
│   │   ├── 📂 (dashboard)/      # Protected dashboard pages
│   │   │   ├── 📄 page.tsx     # Dashboard
│   │   │   ├── 📂 savings/     # Savings accounts
│   │   │   ├── 📂 goals/       # Goals tracking
│   │   │   └── 📂 transactions/ # Transactions
│   │   ├── 📂 api/              # API routes
│   │   ├── 📂 login/           # Login page
│   │   └── 📂 register/        # Registration page
│   ├── 📂 components/          # React components
│   │   ├── 📂 ui/             # shadcn/ui components
│   │   └── 📂 layout/         # Layout components
│   └── 📂 lib/                 # Utilities & configuration
├── 📄 docker-compose.yml        # Docker services
├── 📄 Dockerfile               # Container build
└── 📄 README.md               # This file
```

### API Endpoints

#### Authentication
```
POST /api/auth/register     - Register new user
POST /api/auth/[...nextauth] - NextAuth handlers
```

#### Savings Accounts
```
GET    /api/savings           - List all accounts
POST   /api/savings           - Create account
GET    /api/savings/[id]     - Get account details
PUT    /api/savings/[id]     - Update account
DELETE /api/savings/[id]     - Delete account
```

#### Goals
```
GET    /api/goals             - List all goals
POST   /api/goals             - Create goal
GET    /api/goals/[id]       - Get goal details
PUT    /api/goals/[id]       - Update goal
DELETE /api/goals/[id]       - Delete goal
```

#### Transactions
```
GET    /api/transactions      - List transactions
POST   /api/transactions      - Create transaction
GET    /api/transactions/[id] - Get transaction details
DELETE /api/transactions/[id] - Delete transaction
```

#### Dashboard
```
GET /api/dashboard           - Get aggregated dashboard data
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/be_rich"

# NextAuth
NEXTAUTH_URL="http://localhost:3010"
NEXTAUTH_SECRET="your-secret-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3010"
PORT=3010
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Language:** TypeScript 5.0

### Backend
- **API:** Next.js API Routes
- **ORM:** Prisma 5.0
- **Database:** PostgreSQL 15
- **Auth:** NextAuth.js v4

### DevOps
- **Container:** Docker & Docker Compose
- **Build:** Standalone Output
- **Validation:** Zod
- **Package Manager:** npm

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Gunawan Wibisono**
- GitHub: [@hellogunawan99](https://github.com/hellogunawan99)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕

</div>
