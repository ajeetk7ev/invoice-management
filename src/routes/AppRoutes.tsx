import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Truck } from 'lucide-react'

// Code splitting / Lazy-loaded routes
const InvoiceDashboardPage = lazy(() => import('../pages/InvoiceDashboardPage'))
const InvoiceDetailsPage = lazy(() => import('../pages/InvoiceDetailsPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground animate-bounce">
        <Truck className="h-6 w-6" />
      </div>
      <div className="flex flex-col items-center space-y-1">
        <p className="text-sm font-semibold text-foreground">Loading FreightFox...</p>
        <p className="text-xs text-muted-foreground">Preparing invoice workspace</p>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/invoices" replace />} />
        <Route path="/invoices" element={<InvoiceDashboardPage />} />
        <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
