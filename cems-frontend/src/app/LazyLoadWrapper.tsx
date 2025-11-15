import { Suspense, type ReactNode } from 'react'

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
)

interface LazyLoadWrapperProps {
  children: ReactNode
}

export const LazyLoadWrapper = ({ children }: LazyLoadWrapperProps) => {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
}
