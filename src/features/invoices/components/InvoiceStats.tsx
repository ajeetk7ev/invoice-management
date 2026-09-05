import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import type { InvoiceStats as StatsType } from '../types/invoice.types'
import { formatCurrency } from '../utils/invoice-calculations'

interface InvoiceStatsProps {
  stats: StatsType | null
  isLoading?: boolean
}

export function InvoiceStats({ stats, isLoading }: InvoiceStatsProps) {
  if (isLoading || !stats) {
    return null
  }

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toLocaleString(),
      subtext: `Total Volume: ${formatCurrency(stats.totalAmount, 'INR', true)}`,
      icon: FileText,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      borderColor: 'hover:border-primary/50',
    },
    {
      title: 'Paid Invoices',
      value: stats.paidInvoices.toLocaleString(),
      subtext: `Collected: ${formatCurrency(stats.paidAmount, 'INR', true)}`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      borderColor: 'hover:border-emerald-500/50',
    },
    {
      title: 'Pending Amount',
      value: formatCurrency(stats.pendingAmount, 'INR', true),
      subtext: `${stats.pendingInvoices} invoices awaiting settlement`,
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'hover:border-amber-500/50',
    },
    {
      title: 'Overdue Invoices',
      value: stats.overdueInvoices.toLocaleString(),
      subtext: `At Risk: ${formatCurrency(stats.overdueAmount, 'INR', true)}`,
      icon: AlertTriangle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/50',
      borderColor: 'hover:border-rose-500/50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className={`transition-all duration-200 border-border/70 ${card.borderColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.iconBg} ${card.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
