import { DashboardLayout } from '../components/layout/DashboardLayout'
import { InvoiceDashboard } from '../features/invoices/components/InvoiceDashboard'

export default function InvoiceDashboardPage() {
  return (
    <DashboardLayout>
      <InvoiceDashboard />
    </DashboardLayout>
  )
}
