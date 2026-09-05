import { describe, expect, it } from 'vitest'
import { filterInvoices } from '../features/invoices/utils/invoice-filters'
import type { Invoice } from '../features/invoices/types/invoice.types'

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0001',
    customer: { id: 'c1', name: 'Rajesh Sharma', company: 'Maersk India', email: 'rajesh@maersk.com' },
    customerEmail: 'rajesh@maersk.com',
    issueDate: '2026-03-01',
    dueDate: '2026-03-31',
    status: 'PAID',
    subtotal: 50000,
    tax: 9000,
    total: 59000,
    amountPaid: 59000,
    amountDue: 0,
    currency: 'INR',
    lineItems: [],
    trackingNumber: 'FF-AWB-1001',
    createdAt: '2026-03-01',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-0002',
    customer: { id: 'c2', name: 'Priya Sundaram', company: 'DHL Supply Chain', email: 'priya@dhl.com' },
    customerEmail: 'priya@dhl.com',
    issueDate: '2026-03-15',
    dueDate: '2026-04-15',
    status: 'PENDING',
    subtotal: 30000,
    tax: 5400,
    total: 35400,
    amountPaid: 0,
    amountDue: 35400,
    currency: 'INR',
    lineItems: [],
    trackingNumber: 'FF-AWB-1002',
    createdAt: '2026-03-15',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-0003',
    customer: { id: 'c3', name: 'Vikram Malhotra', company: 'BlueDart Freight', email: 'vikram@bluedart.com' },
    customerEmail: 'vikram@bluedart.com',
    issueDate: '2026-01-10',
    dueDate: '2026-02-10',
    status: 'OVERDUE',
    subtotal: 80000,
    tax: 14400,
    total: 94400,
    amountPaid: 20000,
    amountDue: 74400,
    currency: 'INR',
    lineItems: [],
    trackingNumber: 'FF-AWB-1003',
    createdAt: '2026-01-10',
  },
]

describe('Invoice Filter Utilities', () => {
  it('returns all invoices when filters are empty or ALL', () => {
    const result = filterInvoices(SAMPLE_INVOICES, { status: 'ALL' })
    expect(result).toHaveLength(3)
  })

  it('filters accurately by status', () => {
    const paid = filterInvoices(SAMPLE_INVOICES, { status: 'PAID' })
    expect(paid).toHaveLength(1)
    expect(paid[0].id).toBe('inv-1')

    const pending = filterInvoices(SAMPLE_INVOICES, { status: 'PENDING' })
    expect(pending).toHaveLength(1)
    expect(pending[0].id).toBe('inv-2')

    const overdue = filterInvoices(SAMPLE_INVOICES, { status: 'OVERDUE' })
    expect(overdue).toHaveLength(1)
    expect(overdue[0].id).toBe('inv-3')
  })

  it('filters case-insensitively across invoice number', () => {
    const result = filterInvoices(SAMPLE_INVOICES, { search: '0002' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('inv-2')
  })

  it('filters case-insensitively across customer name and company', () => {
    const byName = filterInvoices(SAMPLE_INVOICES, { search: 'priya' })
    expect(byName).toHaveLength(1)
    expect(byName[0].id).toBe('inv-2')

    const byCompany = filterInvoices(SAMPLE_INVOICES, { search: 'maersk' })
    expect(byCompany).toHaveLength(1)
    expect(byCompany[0].id).toBe('inv-1')
  })

  it('filters case-insensitively across customer email and tracking number', () => {
    const byEmail = filterInvoices(SAMPLE_INVOICES, { search: 'bluedart.com' })
    expect(byEmail).toHaveLength(1)
    expect(byEmail[0].id).toBe('inv-3')

    const byAwb = filterInvoices(SAMPLE_INVOICES, { search: 'AWB-1001' })
    expect(byAwb).toHaveLength(1)
    expect(byAwb[0].id).toBe('inv-1')
  })

  it('filters by date range (from and to)', () => {
    // Only March invoices (inv-1 and inv-2)
    const marchInvoices = filterInvoices(SAMPLE_INVOICES, {
      fromDate: '2026-03-01',
      toDate: '2026-03-31',
    })
    expect(marchInvoices).toHaveLength(2)
    expect(marchInvoices.map((i) => i.id)).toEqual(['inv-1', 'inv-2'])

    // Single specific day
    const singleDay = filterInvoices(SAMPLE_INVOICES, {
      fromDate: '2026-03-15',
      toDate: '2026-03-15',
    })
    expect(singleDay).toHaveLength(1)
    expect(singleDay[0].id).toBe('inv-2')
  })

  it('combines search, status, and date range filters correctly', () => {
    const combined = filterInvoices(SAMPLE_INVOICES, {
      search: 'India',
      status: 'PAID',
      fromDate: '2026-03-01',
      toDate: '2026-03-31',
    })
    expect(combined).toHaveLength(1)
    expect(combined[0].id).toBe('inv-1')

    // Mismatch status
    const noMatch = filterInvoices(SAMPLE_INVOICES, {
      search: 'India',
      status: 'PENDING',
    })
    expect(noMatch).toHaveLength(0)
  })
})
