import type { Invoice, InvoiceSortConfig } from '../types/invoice.types'

/**
 * Pure comparator for sorting invoice records.
 * Handles numbers, strings, and ISO dates without mutating the original array.
 */
export function sortInvoices(
  invoices: readonly Invoice[],
  sortConfig: InvoiceSortConfig
): Invoice[] {
  const { field, direction } = sortConfig
  const modifier = direction === 'asc' ? 1 : -1

  return [...invoices].sort((a, b) => {
    switch (field) {
      case 'invoiceNumber':
        return a.invoiceNumber.localeCompare(b.invoiceNumber, undefined, { numeric: true, sensitivity: 'base' }) * modifier

      case 'customer': {
        const nameA = `${a.customer.name} ${a.customer.company}`.toLowerCase()
        const nameB = `${b.customer.name} ${b.customer.company}`.toLowerCase()
        return nameA.localeCompare(nameB) * modifier
      }

      case 'issueDate': {
        const timeA = new Date(a.issueDate).getTime()
        const timeB = new Date(b.issueDate).getTime()
        return (timeA - timeB) * modifier
      }

      case 'dueDate': {
        const timeA = new Date(a.dueDate).getTime()
        const timeB = new Date(b.dueDate).getTime()
        return (timeA - timeB) * modifier
      }

      case 'total':
        return (a.total - b.total) * modifier

      case 'status':
        return a.status.localeCompare(b.status) * modifier

      default:
        return 0
    }
  })
}
