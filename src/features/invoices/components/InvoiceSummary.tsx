import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import type { Invoice } from '../types/invoice.types'
import { formatCurrency } from '../utils/invoice-calculations'

interface InvoiceSummaryProps {
  invoice: Invoice
}

export function InvoiceSummary({ invoice }: InvoiceSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Financial Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Subtotal (Net Charges):</span>
          <span className="font-mono text-foreground font-medium">
            {formatCurrency(invoice.subtotal, invoice.currency)}
          </span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span>Applicable GST / Tax:</span>
          <span className="font-mono text-foreground font-medium">
            {formatCurrency(invoice.tax, invoice.currency)}
          </span>
        </div>

        <div className="border-t border-border pt-3 flex justify-between items-center text-base font-bold text-foreground">
          <span>Total Billed:</span>
          <span className="font-mono text-primary">
            {formatCurrency(invoice.total, invoice.currency)}
          </span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground text-xs">
          <span>Amount Settled / Paid:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {formatCurrency(invoice.amountPaid, invoice.currency)}
          </span>
        </div>

        <div className="border-t border-dashed border-border pt-2 flex justify-between items-center">
          <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Balance Due:
          </span>
          <span
            className={`font-mono font-bold text-sm ${
              invoice.amountDue > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-muted-foreground'
            }`}
          >
            {formatCurrency(invoice.amountDue, invoice.currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
