import { describe, expect, it } from 'vitest'
import { escapeCsvField, generateCsvString } from '../features/invoices/utils/csv-export'
import type { Invoice } from '../features/invoices/types/invoice.types'

describe('CSV Export Utilities', () => {
  it('escapes fields containing commas with enclosing quotes', () => {
    expect(escapeCsvField('Delhi, India')).toBe('"Delhi, India"')
  })

  it('escapes fields containing quotes by doubling quotes and wrapping', () => {
    expect(escapeCsvField('Project "Alpha" Freight')).toBe('"Project ""Alpha"" Freight"')
  })

  it('escapes fields containing newlines', () => {
    expect(escapeCsvField('Line 1\nLine 2')).toBe('"Line 1\nLine 2"')
  })

  it('leaves simple alphanumeric strings untouched', () => {
    expect(escapeCsvField('INV-2026-0001')).toBe('INV-2026-0001')
    expect(escapeCsvField(12345)).toBe('12345')
  })

  it('handles null and undefined values safely', () => {
    expect(escapeCsvField(null)).toBe('')
    expect(escapeCsvField(undefined)).toBe('')
  })

  it('generates accurate RFC 4180 CSV representation of invoice rows', () => {
    const invoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-001',
        customer: { id: 'c1', name: 'John Doe', company: 'Acme, Logistics Inc.', email: 'john@acme.com' },
        customerEmail: 'john@acme.com',
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
        trackingNumber: 'AWB-100',
        createdAt: '2026-03-01',
      },
    ]

    const csv = generateCsvString(invoices)
    const lines = csv.split('\r\n')

    expect(lines).toHaveLength(2)
    // Header check
    expect(lines[0]).toContain('Invoice Number')
    expect(lines[0]).toContain('Customer Company')
    // Data row check with escaped company name containing comma
    expect(lines[1]).toContain('"Acme, Logistics Inc."')
    expect(lines[1]).toContain('1180.00')
    expect(lines[1]).toContain('PAID')
  })
})
