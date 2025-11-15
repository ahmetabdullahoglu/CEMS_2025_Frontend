import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowRightLeft,
  Users,
  DollarSign,
  Building2,
  FileText,
  Vault,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/useAuth'
import { cn } from '@/lib/utils'

interface MenuItem {
  name: string
  path: string
  icon: React.ElementType
  roles?: ('admin' | 'manager' | 'cashier')[]
}

type MenuRole = NonNullable<MenuItem['roles']>[number]

const isMenuRole = (value: string): value is MenuRole => {
  return value === 'admin' || value === 'manager' || value === 'cashier'
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    name: 'Transactions',
    path: '/transactions',
    icon: ArrowRightLeft,
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    name: 'Customers',
    path: '/customers',
    icon: Users,
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    name: 'Currencies',
    path: '/currencies',
    icon: DollarSign,
    roles: ['admin', 'manager'],
  },
  {
    name: 'Branches',
    path: '/branches',
    icon: Building2,
    roles: ['admin'],
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: FileText,
    roles: ['admin', 'manager'],
  },
  {
    name: 'Vault',
    path: '/vault',
    icon: Vault,
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    name: 'Users',
    path: '/users',
    icon: UserCog,
    roles: ['admin'],
  },
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()

  // Filter menu items based on user roles
  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.roles || !user) return true

    return user.roles.some((role) => {
      const normalizedRole = role.name.toLowerCase()
      if (!isMenuRole(normalizedRole)) {
        return false
      }
      return item.roles?.includes(normalizedRole) ?? false
    })
  })

  return (
    <aside
      className={cn(
        'bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-cems-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="font-bold text-sm">CEMS</h1>
              <p className="text-xs text-muted-foreground">Currency Exchange</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-cems-blue rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">C</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-cems-blue text-white'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0')} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="p-2 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors hover:bg-accent',
            isCollapsed && 'justify-center'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-2 text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
