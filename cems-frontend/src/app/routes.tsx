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
const CustomerDetailsPage = lazy(() => import('@/features/customers/pages/CustomerDetailsPage'))
const CurrenciesPage = lazy(() => import('@/features/currencies/pages/CurrenciesPage'))
const BranchesPage = lazy(() => import('@/features/branches/pages/BranchesPage'))
const BranchDetailsPage = lazy(() => import('@/features/branches/pages/BranchDetailsPage'))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
const VaultPage = lazy(() => import('@/features/vault/pages/VaultPage'))
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))

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
        path: '/forgot-password',
        element: (
          <LazyLoadWrapper>
            <ForgotPasswordPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <LazyLoadWrapper>
            <ResetPasswordPage />
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
        path: 'customers/:id',
        element: (
          <LazyLoadWrapper>
            <CustomerDetailsPage />
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
        path: 'branches/:id',
        element: (
          <LazyLoadWrapper>
            <BranchDetailsPage />
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
          <ProtectedRoute allowedRoles={['admin']}>
            <LazyLoadWrapper>
              <UsersPage />
            </LazyLoadWrapper>
          </ProtectedRoute>
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
