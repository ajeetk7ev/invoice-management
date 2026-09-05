import { describe, expect, it } from 'vitest'
import {
  calculateAmountDue,
  calculateInvoiceStats,
  calculateLineItemAmount,
  calculateLineItemTax,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
} from '../features/invoices/utils/invoice-calculations'
import type { Invoice, LineItem } from '../features/invoices/types/invoice.types'

describe('Invoice Calculations Utilities', () => {
  it('calculates line item amount accurately', () => {
    expect(calculateLineItemAmount(2, 500)).toBe(1000)
    expect(calculateLineItemAmount(3.5, 120)).toBe(420)
    expect(calculateLineItemAmount(0, 500)).toBe(0)
    expect(calculateLineItemAmount(-1, 500)).toBe(0)
  })

  it('calculates line item tax accurately based on rate', () => {
    // 2 items @ 1000 each = 2000, 18% GST = 360
    expect(calculateLineItemTax(2, 1000, 0.18)).toBe(360)
    expect(calculateLineItemTax(1, 45000, 0.18)).toBe(8100)
    expect(calculateLineItemTax(5, 100, 0)).toBe(0)
  })

  it('calculates subtotal across multiple line items', () => {
    const items: LineItem[] = [
      { id: '1', description: 'Item 1', quantity: 2, unitPrice: 1500, taxRate: 0.18, amount: 3000 },
      { id: '2', description: 'Item 2', quantity: 1, unitPrice: 2000, taxRate: 0.18, amount: 2000 },
    ]
    expect(calculateSubtotal(items)).toBe(5000)
  })

  it('calculates total tax across line items with varying tax rates', () => {
    const items: LineItem[] = [
      { id: '1', description: 'Item 1', quantity: 1, unitPrice: 10000, taxRate: 0.18, amount: 10000 }, // 1800
      { id: '2', description: 'Item 2', quantity: 2, unitPrice: 5000, taxRate: 0.12, amount: 10000 },  // 1200
    ]
    expect(calculateTax(items)).toBe(3000)
  })

  it('calculates invoice total (subtotal + tax)', () => {
    expect(calculateTotal(5000, 900)).toBe(5900)
    expect(calculateTotal(10000.5, 1800.09)).toBe(11800.59)
  })

  it('calculates balance due correctly', () => {
    expect(calculateAmountDue(10000, 2500)).toBe(7500)
    expect(calculateAmountDue(10000, 10000)).toBe(0)
    expect(calculateAmountDue(10000, 12000)).toBe(0) // Never returns negative
  })

  it('computes accurate invoice stats aggregated across statuses', () => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-001',
        customer: { id: 'c1', name: 'John', company: 'Acme', email: 'j@a.com' },
        customerEmail: 'j@a.com',
        issueDate: '2026-03-01',
        dueDate: '2026-03-31',
        status: 'PAID',
        subtotal: 1000,
        tax: 180,
        total: 1180,
        amountPaid: 1180,
        amountDue: 0,
        currency: 'INR',
        lineItems: [],
        createdAt: '2026-03-01',
      },
      {
        id: '2',
        invoiceNumber: 'INV-002',
        customer: { id: 'c2', name: 'Bob', company: 'FreightX', email: 'b@f.com' },
        customerEmail: 'b@f.com',
        issueDate: '2026-03-02',
        dueDate: '2026-04-01',
        status: 'PENDING',
        subtotal: 2000,
        tax: 360,
        total: 2360,
        amountPaid: 0,
        amountDue: 2360,
        currency: 'INR',
        lineItems: [],
        createdAt: '2026-03-02',
      },
      {
        id: '3',
        invoiceNumber: 'INV-003',
        customer: { id: 'c3', name: 'Alice', company: 'LogiGlobal', email: 'a@l.com' },
        customerEmail: 'a@l.com',
        issueDate: '2026-01-01',
        dueDate: '2026-01-31',
        status: 'OVERDUE',
        subtotal: 3000,
        tax: 540,
        total: 3540,
        amountPaid: 1000,
        amountDue: 2540,
        currency: 'INR',
        lineItems: [],
        createdAt: '2026-01-01',
      },
      {
        id: '4',
        invoiceNumber: 'INV-004',
        customer: { id: 'c4', name: 'Tom', company: 'Alpha', email: 't@a.com' },
        customerEmail: 't@a.com',
        issueDate: '2026-03-05',
        dueDate: '2026-04-05',
        status: 'DRAFT',
        subtotal: 4000,
        tax: 720,
        total: 4720,
        amountPaid: 0,
        amountDue: 4720,
        currency: 'INR',
        lineItems: [],
        createdAt: '2026-03-05',
      },
    ]

    const stats = calculateInvoiceStats(mockInvoices)
    expect(stats.totalInvoices).toBe(4)
    expect(stats.paidInvoices).toBe(1)
    expect(stats.pendingInvoices).toBe(1)
    expect(stats.overdueInvoices).toBe(1)
    expect(stats.draftInvoices).toBe(1)
    expect(stats.totalAmount).toBe(1180 + 2360 + 3540 + 4720)
    expect(stats.paidAmount).toBe(1180)
    expect(stats.pendingAmount).toBe(2360)
    expect(stats.overdueAmount).toBe(2540)
  })

  it('formats currency correctly in full and compact formats', () => {
    const formatted = formatCurrency(54200, 'INR', false)
    expect(formatted).toContain('54,200')

    const compactLakhs = formatCurrency(482000, 'INR', true)
    expect(compactLakhs).toBe('₹4.82L')

    const compactCrores = formatCurrency(12500000, 'INR', true)
    expect(compactCrores).toBe('₹1.25Cr')
  })
})
