import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

export default function TopBar() {
  const { user, logout } = useAuth()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cashier':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left side - Page title or breadcrumbs can go here */}
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">
            Currency Exchange Management System
          </h2>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          {/* User Info Card */}
          {user && (
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-cems-blue flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>

                  {/* User Details */}
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-foreground">{user.full_name}</p>
                    <div className="flex items-center space-x-2">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(
                            role.name
                          )}`}
                        >
                          {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
