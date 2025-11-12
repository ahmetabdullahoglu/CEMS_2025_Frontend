#!/bin/bash

# CEMS Frontend - Full Setup Script
# Creates complete project structure with all files

set -e

PROJECT_NAME="cems-frontend"
BACKEND_URL="http://localhost:8000/api/v1"

echo "🚀 Creating CEMS Frontend Project - Full Setup"
echo "================================================"

# Check if directory exists
if [ -d "$PROJECT_NAME" ]; then
    echo "❌ Directory $PROJECT_NAME already exists!"
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_NAME"
    else
        exit 1
    fi
fi

# Create project with Vite
echo "📦 Creating Vite project..."
npm create vite@latest $PROJECT_NAME -- --template react-ts

cd $PROJECT_NAME

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing additional packages..."
npm install react-router-dom @tanstack/react-query axios
npm install @hookform/resolvers react-hook-form zod
npm install tailwindcss postcss autoprefixer
npm install date-fns lucide-react sonner recharts
npm install -D @types/node

# Initialize Tailwind
echo "🎨 Setting up Tailwind CSS..."
npx tailwindcss init -p

# Initialize shadcn/ui
echo "🎨 Setting up shadcn/ui..."
npx shadcn-ui@latest init -d

# Create directory structure
echo "📁 Creating directory structure..."

# Main directories
mkdir -p src/{app,components/{ui,common,layout},features,contexts,hooks,lib/{api,utils,validations},services,types,styles}

# Feature directories
mkdir -p src/features/{auth/{pages,components},dashboard/{pages,components},transactions/{pages,components},customers/{pages,components},currencies/pages,branches/{pages,components},vault/{pages,components},reports/{pages,components}}

# Create .env file
echo "⚙️  Creating .env file..."
cat > .env << EOF
VITE_API_BASE_URL=$BACKEND_URL
EOF

# Create basic files
echo "📝 Creating configuration files..."

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
}
EOF

# tsconfig.json update
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create type files
echo "📝 Creating type files..."

cat > src/types/api.types.ts << 'EOF'
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  detail: string;
}
EOF

cat > src/types/auth.types.ts << 'EOF'
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'teller';
  branch_id?: string;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
EOF

cat > src/types/transaction.types.ts << 'EOF'
export type TransactionType = 'exchange' | 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  transaction_number: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  amount: string;
  currency_code?: string;
  created_at: string;
  created_by_name?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  date_from?: string;
  date_to?: string;
  branch_id?: string;
}
EOF

cat > src/types/customer.types.ts << 'EOF'
export type IdType = 'national_id' | 'passport' | 'iqama';

export interface Customer {
  id: string;
  full_name: string;
  id_type: IdType;
  id_number: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
}
EOF

cat > src/types/currency.types.ts << 'EOF'
export interface Currency {
  id: string;
  code: string;
  name: string;
  buy_rate: string;
  sell_rate: string;
  is_active: boolean;
  updated_at: string;
}
EOF

cat > src/types/branch.types.ts << 'EOF'
export interface Branch {
  id: string;
  code: string;
  name: string;
  city: string;
  is_active: boolean;
}

export interface BranchBalance {
  currency_code: string;
  balance: string;
  usd_equivalent: string;
}
EOF

cat > src/types/dashboard.types.ts << 'EOF'
export interface DashboardOverview {
  total_revenue: number;
  total_transactions: number;
  total_customers: number;
  active_branches: number;
  revenue_change_percent: number;
  transactions_change_percent: number;
}

export interface ChartData {
  date: string;
  amount: number;
}
EOF

cat > src/types/report.types.ts << 'EOF'
export interface DailySummary {
  date: string;
  total_transactions: number;
  total_revenue: number;
  revenue_by_type: Record<string, number>;
}

export interface MonthlyRevenue {
  month: string;
  total_revenue: number;
  revenue_by_day: { date: string; amount: number }[];
}
EOF

cat > src/types/vault.types.ts << 'EOF'
export interface VaultBalance {
  currency_code: string;
  balance: string;
}

export interface VaultTransfer {
  id: string;
  transfer_number: string;
  status: string;
  amount: string;
  currency_code: string;
  created_at: string;
}
EOF

# Create API client
echo "📝 Creating API client..."

cat > src/lib/api/client.ts << 'EOF'
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          localStorage.setItem('access_token', data.access_token);
          return apiClient(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
EOF

# Create placeholder files
echo "📝 Creating placeholder files..."

touch src/app/App.tsx
touch src/app/routes.tsx
touch src/contexts/AuthContext.tsx
touch src/styles/globals.css
touch src/lib/api/auth.api.ts
touch src/lib/utils/format.ts
touch src/lib/utils/helpers.ts
touch src/lib/validations/auth.schemas.ts
touch src/lib/validations/transaction.schemas.ts
touch src/lib/validations/customer.schemas.ts
touch src/hooks/useAuth.ts
touch src/hooks/useTransactions.ts
touch src/hooks/useCustomers.ts
touch src/hooks/useCurrencies.ts
touch src/hooks/useBranches.ts
touch src/hooks/useDashboard.ts
touch src/hooks/useReports.ts
touch src/hooks/useVault.ts
touch src/components/common/LoadingSpinner.tsx
touch src/components/common/EmptyState.tsx
touch src/components/common/ErrorAlert.tsx
touch src/components/layout/AppLayout.tsx
touch src/components/layout/Sidebar.tsx
touch src/components/layout/TopBar.tsx
touch src/features/auth/pages/LoginPage.tsx
touch src/features/auth/components/ProtectedRoute.tsx
touch src/features/dashboard/pages/DashboardPage.tsx
touch src/features/dashboard/components/StatCard.tsx
touch src/features/dashboard/components/RevenueChart.tsx
touch src/features/dashboard/components/RecentTransactions.tsx
touch src/features/transactions/pages/TransactionsPage.tsx
touch src/features/transactions/components/TransactionFilters.tsx
touch src/features/transactions/components/TransactionTable.tsx
touch src/features/transactions/components/ExchangeDialog.tsx
touch src/features/transactions/components/IncomeDialog.tsx
touch src/features/transactions/components/ExpenseDialog.tsx
touch src/features/transactions/components/TransferDialog.tsx
touch src/features/transactions/components/TransactionDetailsDialog.tsx
touch src/features/customers/pages/CustomersPage.tsx
touch src/features/customers/pages/CustomerDetailsPage.tsx
touch src/features/customers/components/CustomerTable.tsx
touch src/features/customers/components/CustomerDialog.tsx
touch src/features/customers/components/CustomerInfo.tsx
touch src/features/customers/components/CustomerTransactions.tsx
touch src/features/customers/components/CustomerDocuments.tsx
touch src/features/customers/components/DocumentUpload.tsx
touch src/features/currencies/pages/CurrenciesPage.tsx
touch src/features/currencies/components/CurrencyCard.tsx
touch src/features/currencies/components/UpdateRateDialog.tsx
touch src/features/branches/pages/BranchesPage.tsx
touch src/features/branches/pages/BranchDetailsPage.tsx
touch src/features/branches/components/BranchCard.tsx
touch src/features/branches/components/BranchBalances.tsx
touch src/features/vault/pages/VaultPage.tsx
touch src/features/vault/components/VaultBalances.tsx
touch src/features/vault/components/TransferDialog.tsx
touch src/features/vault/components/PendingTransfers.tsx
touch src/features/reports/pages/ReportsPage.tsx
touch src/features/reports/components/ReportFilters.tsx
touch src/features/reports/components/DailySummary.tsx
touch src/features/reports/components/MonthlyRevenue.tsx
touch src/features/reports/components/BranchPerformance.tsx

# Copy documentation
echo "📚 Copying documentation files..."
cat > README.md << 'EOF'
# CEMS Frontend

Currency Exchange Management System - Frontend Application

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Login Credentials

```
Username: admin@cems.local
Password: Admin@123
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Query
- React Hook Form + Zod
- Recharts

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build

## Documentation

See project documentation files for detailed information.
EOF

echo ""
echo "✅ Project setup complete!"
echo ""
echo "📁 Project created at: $PROJECT_NAME"
echo ""
echo "🚀 Next steps:"
echo "   cd $PROJECT_NAME"
echo "   npm run dev"
echo ""
echo "📖 Documentation:"
echo "   - Check README.md for quick start"
echo "   - Use CONTEXT.md for development"
echo "   - Follow PROMPTS.md for each feature"
echo ""
echo "🎯 Start with Phase 1 prompts!"
EOF
