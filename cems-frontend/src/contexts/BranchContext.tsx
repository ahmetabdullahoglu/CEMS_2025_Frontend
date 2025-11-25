import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './useAuth'
import { useBranches } from '@/hooks/useBranches'
import type { Branch } from '@/types/branch.types'
import type { UserBranch } from '@/types/auth.types'

type BranchOption = Partial<Branch> & Partial<UserBranch> & { id: string }

interface BranchContextValue {
  availableBranches: BranchOption[]
  currentBranchId: string | null
  currentBranch?: BranchOption
  isLoading: boolean
  setCurrentBranchId: (branchId: string) => void
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined)

const BRANCH_STORAGE_KEY = 'cems_current_branch_id'

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const {
    data: branchResponse,
    isLoading,
    isFetching,
  } = useBranches({ enabled: !user?.branches || user.branches.length === 0 })

  const availableBranches: BranchOption[] = useMemo(() => {
    if (user?.branches && user.branches.length > 0) {
      return user.branches
    }

    return branchResponse?.data ?? []
  }, [branchResponse?.data, user?.branches])

  const [currentBranchId, setCurrentBranchId] = useState<string | null>(() => {
    return sessionStorage.getItem(BRANCH_STORAGE_KEY)
  })

  // Hydrate branch selection from storage or user preference
  useEffect(() => {
    if (!user) {
      setCurrentBranchId(null)
      sessionStorage.removeItem(BRANCH_STORAGE_KEY)
      return
    }

    // Wait until we know the available branches before reconciling the selection
    if (!availableBranches.length) return

    const storedBranchId = sessionStorage.getItem(BRANCH_STORAGE_KEY)
    const primaryBranchId =
      user.branches?.find((branch) => branch.is_primary)?.id || user.branches?.[0]?.id

    const preferredBranchId =
      (storedBranchId && availableBranches.some((branch) => branch.id === storedBranchId)
        ? storedBranchId
        : undefined) || primaryBranchId || availableBranches[0]?.id || null

    setCurrentBranchId(preferredBranchId)

    if (preferredBranchId) {
      sessionStorage.setItem(BRANCH_STORAGE_KEY, preferredBranchId)
    } else {
      sessionStorage.removeItem(BRANCH_STORAGE_KEY)
    }
  }, [availableBranches, user])

  const setBranch = useCallback((branchId: string) => {
    setCurrentBranchId(branchId)
    sessionStorage.setItem(BRANCH_STORAGE_KEY, branchId)
  }, [])

  const currentBranch = useMemo(
    () => availableBranches.find((branch) => branch.id === currentBranchId),
    [availableBranches, currentBranchId]
  )

  const value: BranchContextValue = {
    availableBranches,
    currentBranchId,
    currentBranch,
    isLoading: isLoading || isFetching,
    setCurrentBranchId: setBranch,
  }

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBranchSelection = () => {
  const context = useContext(BranchContext)

  if (!context) {
    throw new Error('useBranchSelection must be used within a BranchProvider')
  }

  return context
}
