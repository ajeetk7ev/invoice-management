import type { Invoice } from '../types/invoice.types'

/**
 * Escapes a field according to RFC 4180 CSV standard.
 * If the value contains commas, double quotes, or newlines, it is enclosed in double quotes,
 * and any inner double quotes are escaped by doubling them ("").
 */
export function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  const str = String(value)
  const needsEscaping = str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')

  if (needsEscaping) {
    return `"${str.replace(/"/g, '""')}"`
  }

  return str
}

/**
 * Generates an RFC 4180 CSV string from an array of invoices.
 */
export function generateCsvString(invoices: readonly Invoice[]): string {
  const headers = [
    'Invoice Number',
    'Customer Name',
    'Customer Company',
    'Customer Email',
    'Issue Date',
    'Due Date',
    'Status',
    'Currency',
    'Subtotal',
    'Tax',
    'Total',
    'Amount Paid',
    'Amount Due',
    'Tracking Number',
  ]

  // In Excel, dates and alphanumeric IDs in CSVs often show as ##### or lose leading formatting.
  // Using ="value" forces Excel and spreadsheet applications to display them as text without #####.
  const formatTextCell = (val: string | undefined | null) => (val ? `="${val}"` : '')

  const rows = invoices.map((inv) => [
    formatTextCell(inv.invoiceNumber),
    inv.customer.name,
    inv.customer.company,
    inv.customer.email,
    formatTextCell(inv.issueDate),
    formatTextCell(inv.dueDate),
    inv.status,
    inv.currency,
    inv.subtotal.toFixed(2),
    inv.tax.toFixed(2),
    inv.total.toFixed(2),
    inv.amountPaid.toFixed(2),
    inv.amountDue.toFixed(2),
    formatTextCell(inv.trackingNumber || ''),
  ])

  const csvContent = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) => row.map(escapeCsvField).join(',')),
  ].join('\r\n')

  return csvContent
}

/**
 * Triggers a browser download of the CSV content.
 */
export function downloadCsvFile(csvContent: string, filename: string = 'freightfox-invoices.csv'): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convenience method to generate and trigger CSV download.
 */
export function exportInvoicesToCsv(
  invoices: readonly Invoice[],
  filename?: string
): void {
  const csv = generateCsvString(invoices)
  const name = filename || `invoices_export_${new Date().toISOString().split('T')[0]}.csv`
  downloadCsvFile(csv, name)
}
