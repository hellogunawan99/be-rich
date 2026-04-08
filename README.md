# BeRich - Personal Finance Management Platform

A modern, full-stack personal finance management application built with Next.js 16, shadcn/ui, Tailwind CSS, and PostgreSQL.

## Features

- **Dashboard**: Overview of your total balance, monthly income/expenses, and active goals with progress tracking
- **Savings Accounts**: Create and manage multiple savings accounts with custom icons and colors
- **Goals Tracking**: Set financial goals with target amounts and deadlines, automatically track progress from linked savings accounts
- **Transactions**: Record income and expenses, automatically update account balances
- **Authentication**: Secure user authentication with NextAuth.js
- **Modern UI**: Beautiful, responsive interface with emerald and purple accent colors
- **Mobile Responsive**: Fully responsive design that works on mobile and desktop

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide React icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v4
- **State Management**: React Query (TanStack Query)
- **Validation**: Zod

## Prerequisites

- Node.js 18+ installed (for local development)
- Docker and Docker Compose installed
- npm or yarn package manager (for local development)

## Docker Deployment

The easiest way to run BeRich is using Docker Compose, which will set up both the PostgreSQL database and the application.

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/hellogunawan99/be-rich.git
cd be-rich
```

2. Start the application with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
- **URL:** http://localhost:3010
- **Database:** PostgreSQL on port 5432

4. To view logs:
```bash
docker-compose logs -f app
```

5. To stop:
```bash
docker-compose down
```

6. To rebuild after code changes:
```bash
docker-compose up -d --build
```

### Docker Services

**app** - Next.js application
- Port: 3010
- Depends on: db (PostgreSQL)

**db** - PostgreSQL database
- Port: 5432
- Credentials: developer / CANcer471422;
- Database: be_rich
- Data persists in Docker volume

### Environment Variables

The application uses these environment variables (pre-configured in docker-compose.yml):
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Authentication URL
- `NEXTAUTH_SECRET` - Session secret key
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `PORT` - Server port (3010)

### Database Migrations

When the container starts, you may need to run migrations manually:
```bash
docker-compose exec app npx prisma migrate deploy
```

Or to open Prisma Studio:
```bash
docker-compose exec app npx prisma studio
```

## Database Setup

The application uses PostgreSQL. You'll need to:

1. Create a PostgreSQL database
2. Update the `.env` file with your actual database credentials
3. Run migrations

### Example Database Configuration

```
DATABASE_URL="postgresql://username:password@localhost:5432/be_rich?schema=public"
```

Replace `username`, `password`, and `be_rich` with your actual PostgreSQL credentials.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd be-rich
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your actual database credentials.

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3010](http://localhost:3010) in your browser

## Usage

### Registration
1. Navigate to the registration page
2. Create your account with name, email, and password
3. You'll be automatically logged in after registration

### Dashboard
The dashboard provides a quick overview of:
- Total balance across all savings accounts (displayed in IDR)
- Monthly income and expenses
- Active goals count
- Recent transactions
- Top active goals with progress and days remaining

### Managing Savings Accounts
1. Go to the "Savings" page
2. Click "Add Account" to create a new savings account
3. Choose an icon, color, and initial balance
4. View all your accounts and their balances
5. Delete accounts with confirmation dialog

### Tracking Goals
1. Navigate to the "Goals" page
2. Click "Create Goal" to set a new financial goal
3. Specify the target amount and deadline
4. Optionally link the goal to a savings account for automatic progress tracking
5. Track your progress visually with progress bars
6. View days remaining until deadline
7. Delete goals with confirmation dialog

**Auto-Tracking Feature:**
- Link a savings account to your goal
- Progress automatically updates based on the linked account's balance
- When you add income to the savings account, goal progress increases automatically

### Recording Transactions
1. Go to the "Transactions" page
2. Click "Add Transaction"
3. Choose between income or expense
4. Enter amount, description, and category
5. Select which savings account to apply the transaction to
6. The account balance will automatically update
7. Delete transactions with confirmation dialog

## Project Structure

```
be-rich/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── savings/       # Savings accounts
│   │   │   ├── goals/         # Goals tracking
│   │   │   └── transactions/ # Transactions
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication
│   │   │   ├── savings/      # Savings API
│   │   │   ├── goals/       # Goals API
│   │   │   ├── transactions/ # Transactions API
│   │   │   └── dashboard/    # Dashboard API
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── layout/          # Layout components
│   │   └── ...
│   └── lib/
│       ├── auth.ts           # NextAuth configuration
│       ├── prisma.ts        # Prisma client
│       └── getServerSession.ts
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Savings Accounts
- `GET /api/savings` - List all savings accounts
- `POST /api/savings` - Create savings account
- `GET /api/savings/[id]` - Get savings account
- `PUT /api/savings/[id]` - Update savings account
- `DELETE /api/savings/[id]` - Delete savings account

### Goals
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create goal
- `GET /api/goals/[id]` - Get goal
- `PUT /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/[id]` - Get transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Dashboard
- `GET /api/dashboard` - Get dashboard aggregated data

## Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Security Notes

- Never commit actual credentials to the repository
- Always use environment variables for sensitive data
- The `.env` file is gitignored and will not be pushed
- Use `.env.example` as a template with placeholder values

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
