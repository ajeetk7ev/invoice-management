import { describe, expect, it } from 'vitest'
import { sortInvoices } from '../features/invoices/utils/invoice-sort'
import type { Invoice } from '../features/invoices/types/invoice.types'

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-0003',
    customer: { id: 'c3', name: 'Vikram', company: 'Zeta Freight', email: 'v@z.com' },
    customerEmail: 'v@z.com',
    issueDate: '2026-03-20',
    dueDate: '2026-04-20',
    status: 'PENDING',
    subtotal: 90000,
    tax: 16200,
    total: 106200,
    amountPaid: 0,
    amountDue: 106200,
    currency: 'INR',
    lineItems: [],
    createdAt: '2026-03-20',
  },
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0001',
    customer: { id: 'c1', name: 'Ananya', company: 'Alpha Freight', email: 'a@a.com' },
    customerEmail: 'a@a.com',
    issueDate: '2026-01-10',
    dueDate: '2026-02-10',
    status: 'PAID',
    subtotal: 30000,
    tax: 5400,
    total: 35400,
    amountPaid: 35400,
    amountDue: 0,
    currency: 'INR',
    lineItems: [],
    createdAt: '2026-01-10',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-0002',
    customer: { id: 'c2', name: 'Rajesh', company: 'Beta Freight', email: 'r@b.com' },
    customerEmail: 'r@b.com',
    issueDate: '2026-02-15',
    dueDate: '2026-03-15',
    status: 'OVERDUE',
    subtotal: 50000,
    tax: 9000,
    total: 59000,
    amountPaid: 10000,
    amountDue: 49000,
    currency: 'INR',
    lineItems: [],
    createdAt: '2026-02-15',
  },
]

describe('Invoice Sort Utilities', () => {
  it('sorts by total amount ascending and descending', () => {
    const asc = sortInvoices(SAMPLE_INVOICES, { field: 'total', direction: 'asc' })
    expect(asc.map((i) => i.id)).toEqual(['inv-1', 'inv-2', 'inv-3'])

    const desc = sortInvoices(SAMPLE_INVOICES, { field: 'total', direction: 'desc' })
    expect(desc.map((i) => i.id)).toEqual(['inv-3', 'inv-2', 'inv-1'])
  })

  it('sorts by issueDate chronologically', () => {
    const asc = sortInvoices(SAMPLE_INVOICES, { field: 'issueDate', direction: 'asc' })
    expect(asc.map((i) => i.id)).toEqual(['inv-1', 'inv-2', 'inv-3'])

    const desc = sortInvoices(SAMPLE_INVOICES, { field: 'issueDate', direction: 'desc' })
    expect(desc.map((i) => i.id)).toEqual(['inv-3', 'inv-2', 'inv-1'])
  })

  it('sorts by customer name alphabetically', () => {
    const asc = sortInvoices(SAMPLE_INVOICES, { field: 'customer', direction: 'asc' })
    expect(asc[0].customer.name).toBe('Ananya')
    expect(asc[2].customer.name).toBe('Vikram')

    const desc = sortInvoices(SAMPLE_INVOICES, { field: 'customer', direction: 'desc' })
    expect(desc[0].customer.name).toBe('Vikram')
    expect(desc[2].customer.name).toBe('Ananya')
  })

  it('sorts by invoice number naturally', () => {
    const asc = sortInvoices(SAMPLE_INVOICES, { field: 'invoiceNumber', direction: 'asc' })
    expect(asc.map((i) => i.invoiceNumber)).toEqual([
      'INV-2026-0001',
      'INV-2026-0002',
      'INV-2026-0003',
    ])
  })
})
