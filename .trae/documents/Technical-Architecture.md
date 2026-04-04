# BeRich - Technical Architecture

## 1. Architecture Design

```mermaid
graph TB
    subgraph Frontend
        A[Next.js 14 App Router]
        B[React Components]
        C[shadcn/ui Components]
        D[Tailwind CSS]
        E[React Query]
    end
    
    subgraph Backend
        F[Next.js API Routes]
        G[Prisma ORM]
        H[NextAuth.js]
    end
    
    subgraph Database
        I[PostgreSQL]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    E --> F
    F --> G
    G --> I
    A --> H
    H --> I
```

## 2. Technology Stack

### 2.1 Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization

### 2.2 Backend
- **Runtime**: Next.js API Routes (Serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js with Credentials provider
- **Validation**: Zod

### 2.3 Database
- **Database**: PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Credentials**: 
  - Username: developer
  - Password: CANcer471422;
  - Database Name: be_rich

## 3. Route Definitions

### 3.1 Pages (Frontend)
| Route | Purpose | Components |
|-------|---------|------------|
| / | Dashboard with financial overview | OverviewCard, StatsGrid, RecentActivity, GoalsPreview |
| /savings | Manage savings accounts | SavingsList, SavingsCard, AddSavingsModal |
| /goals | Track financial goals | GoalsGrid, GoalCard, ProgressRing, CreateGoalWizard |
| /transactions | View and manage transactions | TransactionTable, Filters, AddTransactionModal |
| /login | User authentication | LoginForm |
| /register | New user registration | RegisterForm |

### 3.2 API Routes (Backend)
| Route | Method | Purpose |
|-------|--------|---------|
| /api/auth/[...nextauth] | GET, POST | Authentication endpoints |
| /api/auth/register | POST | User registration |
| /api/savings | GET, POST | List and create savings accounts |
| /api/savings/[id] | GET, PUT, DELETE | Individual savings account operations |
| /api/goals | GET, POST | List and create goals |
| /api/goals/[id] | GET, PUT, DELETE | Individual goal operations |
| /api/transactions | GET, POST | List and create transactions |
| /api/transactions/[id] | GET, PUT, DELETE | Individual transaction operations |
| /api/dashboard | GET | Dashboard aggregated data |

## 4. API Definitions

### 4.1 Savings Account API

**Type Definitions:**
```typescript
interface SavingsAccount {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateSavingsRequest {
  name: string;
  balance: number;
  icon?: string;
  color?: string;
}

interface UpdateSavingsRequest {
  name?: string;
  balance?: number;
  icon?: string;
  color?: string;
}
```

### 4.2 Goals API

**Type Definitions:**
```typescript
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  status: 'active' | 'completed' | 'overdue';
  linkedSavingsId?: string;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateGoalRequest {
  name: string;
  targetAmount: number;
  deadline: Date;
  linkedSavingsId?: string;
  icon?: string;
  color?: string;
}

interface UpdateGoalRequest {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: Date;
  status?: 'active' | 'completed' | 'overdue';
  linkedSavingsId?: string;
}
```

### 4.3 Transaction API

**Type Definitions:**
```typescript
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  savingsAccountId: string;
  date: Date;
  createdAt: Date;
}

interface CreateTransactionRequest {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  savingsAccountId: string;
  date?: Date;
}
```

## 5. Server Architecture

```mermaid
graph LR
    A[API Request] --> B[Next.js Route Handler]
    B --> C[Validation Middleware]
    C --> D[Service Layer]
    D --> E[Repository Layer]
    E --> F[Prisma Client]
    F --> G[PostgreSQL Database]
```

## 6. Data Model

### 6.1 Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ SavingsAccount : has
    User ||--o{ Goal : has
    User ||--o{ Transaction : has
    SavingsAccount ||--o{ Transaction : contains
    SavingsAccount ||--o{ Goal : linked_to
    
    User {
        uuid id PK
        string email
        string password
        string name
        datetime createdAt
        datetime updatedAt
    }
    
    SavingsAccount {
        uuid id PK
        uuid userId FK
        string name
        decimal balance
        string icon
        string color
        datetime createdAt
        datetime updatedAt
    }
    
    Goal {
        uuid id PK
        uuid userId FK
        uuid savingsAccountId FK
        string name
        decimal targetAmount
        decimal currentAmount
        datetime deadline
        enum status
        string icon
        string color
        datetime createdAt
        datetime updatedAt
    }
    
    Transaction {
        uuid id PK
        uuid userId FK
        uuid savingsAccountId FK
        enum type
        decimal amount
        string description
        string category
        datetime date
        datetime createdAt
    }
```

### 6.2 Database Schema (DDL)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Savings accounts table
CREATE TABLE savings_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0,
    icon VARCHAR(50) DEFAULT 'wallet',
    color VARCHAR(20) DEFAULT '#10b981',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goals table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    savings_account_id UUID REFERENCES savings_accounts(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue')),
    icon VARCHAR(50) DEFAULT 'target',
    color VARCHAR(20) DEFAULT '#f59e0b',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    savings_account_id UUID NOT NULL REFERENCES savings_accounts(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_savings_accounts_user_id ON savings_accounts(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_savings_account_id ON goals(savings_account_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_savings_account_id ON transactions(savings_account_id);
CREATE INDEX idx_transactions_date ON transactions(date);
```

## 7. Project Structure

```
be-rich/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx (Dashboard)
│   │   │   ├── savings/
│   │   │   ├── goals/
│   │   │   └── transactions/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── savings/
│   │   │   ├── goals/
│   │   │   └── transactions/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── dashboard/
│   │   ├── savings/
│   │   ├── goals/
│   │   └── transactions/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/
│   └── types/
├── .env
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## 8. Environment Configuration

```env
# Database
DATABASE_URL="postgresql://developer:CANcer471422;@localhost:5432/be_rich?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
