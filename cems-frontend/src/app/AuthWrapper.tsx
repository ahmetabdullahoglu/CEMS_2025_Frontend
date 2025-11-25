import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { BranchProvider } from '@/contexts/BranchContext'

export default function AuthWrapper() {
  return (
    <AuthProvider>
      <BranchProvider>
        <Outlet />
      </BranchProvider>
    </AuthProvider>
  )
}
