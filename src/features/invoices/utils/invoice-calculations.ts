import type { Invoice, InvoiceStats, LineItem } from '../types/invoice.types'

/**
 * Calculates net line item amount before tax.
 */
export function calculateLineItemAmount(quantity: number, unitPrice: number): number {
  if (quantity < 0 || unitPrice < 0) return 0
  return Math.round(quantity * unitPrice * 100) / 100
}

/**
 * Calculates tax for a specific line item based on its tax rate.
 */
export function calculateLineItemTax(quantity: number, unitPrice: number, taxRate: number): number {
  if (quantity < 0 || unitPrice < 0 || taxRate < 0) return 0
  const net = quantity * unitPrice
  return Math.round(net * taxRate * 100) / 100
}

/**
 * Calculates invoice subtotal from line items.
 * Subtotal = Sum of (quantity * unitPrice)
 */
export function calculateSubtotal(lineItems: readonly LineItem[]): number {
  const sum = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
  return Math.round(sum * 100) / 100
}

/**
 * Calculates total tax across all line items.
 */
export function calculateTax(lineItems: readonly LineItem[]): number {
  const sum = lineItems.reduce((acc, item) => {
    return acc + (item.quantity * item.unitPrice * (item.taxRate || 0))
  }, 0)
  return Math.round(sum * 100) / 100
}

/**
 * Calculates invoice total (subtotal + tax).
 */
export function calculateTotal(subtotal: number, tax: number): number {
  return Math.round((subtotal + tax) * 100) / 100
}

/**
 * Calculates balance due (total - amountPaid).
 * Guarantees result is never negative due to rounding.
 */
export function calculateAmountDue(total: number, amountPaid: number): number {
  const due = total - amountPaid
  return Math.max(0, Math.round(due * 100) / 100)
}

/**
 * Calculates aggregate invoice metrics from an array of invoices.
 */
export function calculateInvoiceStats(invoices: readonly Invoice[]): InvoiceStats {
  const stats: InvoiceStats = {
    totalInvoices: invoices.length,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    draftInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
  }

  for (const inv of invoices) {
    stats.totalAmount += inv.total

    switch (inv.status) {
      case 'PAID':
        stats.paidInvoices += 1
        stats.paidAmount += inv.total
        break
      case 'PENDING':
        stats.pendingInvoices += 1
        stats.pendingAmount += inv.amountDue
        break
      case 'OVERDUE':
        stats.overdueInvoices += 1
        stats.overdueAmount += inv.amountDue
        break
      case 'DRAFT':
        stats.draftInvoices += 1
        break
    }
  }

  // Round all totals to 2 decimal places
  stats.totalAmount = Math.round(stats.totalAmount * 100) / 100
  stats.paidAmount = Math.round(stats.paidAmount * 100) / 100
  stats.pendingAmount = Math.round(stats.pendingAmount * 100) / 100
  stats.overdueAmount = Math.round(stats.overdueAmount * 100) / 100

  return stats
}

/**
 * Formats a numeric value into localized Indian Rupee (or specified currency) string.
 * Supports compact formatting (e.g. ₹4.82L or standard ₹4,82,000).
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  compact: boolean = false
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0.00'
  }

  if (compact && currency === 'INR') {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
