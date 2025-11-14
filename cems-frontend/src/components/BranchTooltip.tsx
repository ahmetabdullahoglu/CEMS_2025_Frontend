import { useState } from 'react'
import { Building2, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react'
import type { Branch } from '@/types/branch.types'

interface BranchTooltipProps {
  branch: Branch | null | undefined
  branchId?: string
  children?: React.ReactNode
}

export function BranchTooltip({ branch, branchId, children }: BranchTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!branch) {
    return <span className="text-muted-foreground">Branch #{branchId || 'Unknown'}</span>
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => e.preventDefault()}
      >
        {children || branch.name}
      </button>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white border rounded-lg shadow-lg p-4 pointer-events-none">
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-8 border-transparent border-t-white" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-gray-200" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{branch.name}</p>
                <p className="text-xs text-muted-foreground">Code: {branch.code}</p>
              </div>
            </div>

            {branch.address && (
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{branch.address}</span>
              </div>
            )}

            {branch.phone && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{branch.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs pt-2 border-t">
              {branch.is_active ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">Inactive</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
