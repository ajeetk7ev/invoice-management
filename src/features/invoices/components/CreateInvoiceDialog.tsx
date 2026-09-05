import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/Dialog'
import { Input } from '../../../components/ui/Input'
import { invoiceService } from '../services/invoice.service'
import { useInvoiceStore } from '../store/invoice.store'
import type { CreateInvoiceInput } from '../types/invoice.types'
import { formatCurrency } from '../utils/invoice-calculations'

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormErrors {
  invoiceNumber?: string
  customerName?: string
  customerCompany?: string
  customerEmail?: string
  issueDate?: string
  dueDate?: string
  lineItems?: string
}

let nextInvoiceSeed = 9101

function getNextDefaultInvoiceNumber(): string {
  return `INV-2026-${nextInvoiceSeed++}`
}

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const triggerRefresh = useInvoiceStore((state) => state.triggerRefresh)

  const [invoiceNumber, setInvoiceNumber] = React.useState(getNextDefaultInvoiceNumber)
  const [customerCompany, setCustomerCompany] = React.useState('')
  const [customerName, setCustomerName] = React.useState('')
  const [customerEmail, setCustomerEmail] = React.useState('')
  const [issueDate, setIssueDate] = React.useState(() => new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = React.useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split('T')[0]
  })
  const [originHub, setOriginHub] = React.useState('Bhiwandi Central Hub, Mumbai')
  const [destinationHub, setDestinationHub] = React.useState('Nelamangala Logistics Park, Bangalore')

  const [lineItems, setLineItems] = React.useState<
    { description: string; quantity: number; unitPrice: number; taxRate: number }[]
  >([
    {
      description: 'Dedicated FTL Line-Haul Freight Transit',
      quantity: 1,
      unitPrice: 45000,
      taxRate: 0.18,
    },
  ])

  const [errors, setErrors] = React.useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Subtotal and tax preview
  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
  const tax = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice * item.taxRate, 0)
  const total = subtotal + tax

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!invoiceNumber.trim()) errs.invoiceNumber = 'Invoice number is required'
    if (!issueDate) errs.issueDate = 'Issue date is required'
    if (!dueDate) errs.dueDate = 'Due date is required'
    if (issueDate && dueDate && new Date(dueDate) < new Date(issueDate)) {
      errs.dueDate = 'Due date cannot be prior to issue date'
    }
    if (!customerCompany.trim()) errs.customerCompany = 'Company name is required'
    if (!customerName.trim()) errs.customerName = 'Customer contact name is required'
    if (!customerEmail.trim()) {
      errs.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errs.customerEmail = 'Invalid email address format'
    }

    if (lineItems.length === 0) {
      errs.lineItems = 'At least one line item is required'
    } else {
      for (const item of lineItems) {
        if (!item.description.trim() || item.quantity <= 0 || item.unitPrice <= 0) {
          errs.lineItems = 'All line items must have a valid description, quantity (>0), and rate (>0)'
          break
        }
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { description: 'Terminal Cargo Handling & Storage', quantity: 1, unitPrice: 12500, taxRate: 0.18 },
    ])
  }

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value }
        }
        return item
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const input: CreateInvoiceInput = {
        invoiceNumber,
        customer: {
          name: customerName,
          company: customerCompany,
          email: customerEmail,
        },
        issueDate,
        dueDate,
        status: 'PENDING',
        originHub,
        destinationHub,
        lineItems,
        notes: 'Generated via FreightFox Invoice Management System.',
      }

      await invoiceService.createInvoice(input)
      triggerRefresh()
      onOpenChange(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[85vh] max-h-[660px] p-0 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="p-6 pb-4 border-b border-border shrink-0">
          <DialogHeader className="mb-0">
            <DialogTitle>Create New Freight Invoice</DialogTitle>
            <DialogDescription className="mt-1">
              Add a new commercial invoice with customer details and line-item freight charges.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Body - Single field per row */}
        <form id="create-invoice-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Row: Invoice Number */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Invoice Number *</label>
            <Input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-2026-XXXX"
            />
            {errors.invoiceNumber && (
              <p className="text-[11px] text-destructive">{errors.invoiceNumber}</p>
            )}
          </div>

          {/* Row: Issue Date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Issue Date *</label>
            <Input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
            {errors.issueDate && (
              <p className="text-[11px] text-destructive">{errors.issueDate}</p>
            )}
          </div>

          {/* Row: Due Date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Due Date *</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {errors.dueDate && (
              <p className="text-[11px] text-destructive">{errors.dueDate}</p>
            )}
          </div>

          {/* Row: Customer Company Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Customer Company Name *</label>
            <Input
              value={customerCompany}
              onChange={(e) => setCustomerCompany(e.target.value)}
              placeholder="e.g. Acme Logistics Pvt Ltd"
            />
            {errors.customerCompany && (
              <p className="text-[11px] text-destructive">{errors.customerCompany}</p>
            )}
          </div>

          {/* Row: Customer Contact Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Contact Person Name *</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rajesh Sharma"
            />
            {errors.customerName && (
              <p className="text-[11px] text-destructive">{errors.customerName}</p>
            )}
          </div>

          {/* Row: Customer Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Customer Email Address *</label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. billing@company.com"
            />
            {errors.customerEmail && (
              <p className="text-[11px] text-destructive">{errors.customerEmail}</p>
            )}
          </div>

          {/* Row: Origin Hub */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Origin Hub (Optional)</label>
            <Input
              value={originHub}
              onChange={(e) => setOriginHub(e.target.value)}
              placeholder="e.g. Bhiwandi Central Hub, Mumbai"
            />
          </div>

          {/* Row: Destination Hub */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Destination Hub (Optional)</label>
            <Input
              value={destinationHub}
              onChange={(e) => setDestinationHub(e.target.value)}
              placeholder="e.g. Nelamangala Logistics Park, Bangalore"
            />
          </div>

          {/* Line Items Section */}
          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Line Items & Charges
                </h4>
                <p className="text-[11px] text-muted-foreground">Add itemized freight charges</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLineItem}
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Charge</span>
              </Button>
            </div>

            {errors.lineItems && (
              <p className="text-xs text-destructive">{errors.lineItems}</p>
            )}

            <div className="space-y-3">
              {lineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/40 rounded-lg border border-border space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Item #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLineItem(idx)}
                      disabled={lineItems.length === 1}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                      title="Remove charge"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      <span>Remove</span>
                    </Button>
                  </div>

                  {/* Field: Description */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">Charge Description</label>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Container Line-Haul transit"
                      className="h-8 text-xs"
                    />
                  </div>

                  {/* Field: Quantity and Rate */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Quantity</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Unit Rate (₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="500"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-right text-xs font-semibold text-foreground pt-1">
                    Amount: {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary Preview */}
          <div className="rounded-lg bg-muted/60 p-3 space-y-1.5 text-xs border border-border">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST (18%):</span>
              <span className="font-semibold text-foreground">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-border pt-1.5">
              <span>Total Invoice Amount:</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-border bg-muted/10 shrink-0">
          <DialogFooter className="mt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form="create-invoice-form" isLoading={isSubmitting}>
              Create Invoice
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
