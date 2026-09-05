import { Building2, Calendar, MapPin, Truck } from 'lucide-react'
import { StatusBadge } from '../../../components/common/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import type { Invoice } from '../types/invoice.types'
import { InvoiceActions } from './InvoiceActions'
import { InvoiceLineItems } from './InvoiceLineItems'
import { InvoiceSummary } from './InvoiceSummary'

interface InvoiceDetailsProps {
  invoice: Invoice
  onInvoiceUpdated?: (updated: Invoice) => void
}

export function InvoiceDetails({ invoice, onInvoiceUpdated }: InvoiceDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Top Action Bar with Back Link */}
      <InvoiceActions invoice={invoice} onInvoiceUpdated={onInvoiceUpdated} />

      {/* Main Invoice Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border p-6 rounded-xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold font-mono tracking-tight text-foreground">
              {invoice.invoiceNumber}
            </h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            Created on {new Date(invoice.createdAt).toLocaleDateString()} • SLA Terms:{' '}
            {invoice.paymentTerms || 'Net 30 Days'}
          </p>
        </div>

        {/* Date chips */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-muted/50 p-3 rounded-lg border border-border">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground font-medium uppercase text-[10px]">Issue Date</div>
              <div className="font-semibold text-foreground">{invoice.issueDate}</div>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-border" />
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-rose-500" />
            <div>
              <div className="text-muted-foreground font-medium uppercase text-[10px]">Due Date</div>
              <div className="font-semibold text-foreground">{invoice.dueDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Customer Info & Logistics Transit Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Customer & Consignee</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company:
              </span>
              <p className="font-bold text-foreground text-base leading-tight">
                {invoice.customer.company}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Point of Contact:
              </span>
              <p className="text-foreground">{invoice.customer.name}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address:
              </span>
              <p className="text-foreground font-mono text-xs">{invoice.customer.email}</p>
            </div>
            {invoice.customer.taxId && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  GSTIN / Tax ID:
                </span>
                <p className="font-mono text-xs text-foreground font-medium">
                  {invoice.customer.taxId}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Billing Address:
              </span>
              <p className="text-xs text-muted-foreground">
                {invoice.customer.address}, {invoice.customer.city}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logistics Transit & Waybill Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Freight Transit Route</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Air Waybill / Consignment Tracking:
              </span>
              <p className="font-mono font-bold text-foreground text-sm">
                {invoice.trackingNumber || 'N/A'}
              </p>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-muted-foreground">Origin Hub:</span>
                <p className="text-foreground text-xs">{invoice.originHub || 'Central Dispatch Hub'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-muted-foreground">Destination Hub:</span>
                <p className="text-foreground text-xs">{invoice.destinationHub || 'Regional Receiving Yard'}</p>
              </div>
            </div>
            {invoice.notes && (
              <div className="pt-2 border-t border-border/80">
                <span className="text-[11px] font-semibold uppercase text-muted-foreground">Operational Notes:</span>
                <p className="text-xs text-muted-foreground italic mt-0.5">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Itemized Line Items Table */}
      <InvoiceLineItems invoice={invoice} />

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-2 text-xs text-muted-foreground">
          <h4 className="font-semibold text-foreground text-sm">Electronic Tax Invoice Notice</h4>
          <p>
            This invoice is generated according to logistics carrier billing agreements and Indian GST
            regulations. Payment is due as per stipulated contractual terms.
          </p>
          <p className="font-mono text-[11px]">FreightFox Platform ID: {invoice.id}</p>
        </div>

        <InvoiceSummary invoice={invoice} />
      </div>
    </div>
  )
}
