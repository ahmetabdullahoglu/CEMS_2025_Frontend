import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import AuthWrapper from './AuthWrapper'

// Lazy load pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const TransactionsPage = lazy(() => import('@/features/transactions/pages/TransactionsPage'))
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage'))
const CurrenciesPage = lazy(() => import('@/pages/currencies/CurrenciesPage'))
const BranchesPage = lazy(() => import('@/pages/branches/BranchesPage'))
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'))
const VaultPage = lazy(() => import('@/pages/vault/VaultPage'))
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Wrapper component for lazy-loaded pages
const LazyLoadWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
)

// Router configuration
export const router = createBrowserRouter([
  {
    element: <AuthWrapper />,
    children: [
      {
        path: '/login',
        element: (
          <LazyLoadWrapper>
            <LoginPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <LazyLoadWrapper>
            <DashboardPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'transactions',
        element: (
          <LazyLoadWrapper>
            <TransactionsPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'customers',
        element: (
          <LazyLoadWrapper>
            <CustomersPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'currencies',
        element: (
          <LazyLoadWrapper>
            <CurrenciesPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'branches',
        element: (
          <LazyLoadWrapper>
            <BranchesPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'reports',
        element: (
          <LazyLoadWrapper>
            <ReportsPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'vault',
        element: (
          <LazyLoadWrapper>
            <VaultPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <LazyLoadWrapper>
            <UsersPage />
          </LazyLoadWrapper>
        ),
      },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
])
