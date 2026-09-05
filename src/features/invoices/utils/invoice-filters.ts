import type { Invoice, InvoiceFilterParams } from '../types/invoice.types'

/**
 * Pure function to filter invoices according to search text, status, and date range.
 */
export function filterInvoices(
  invoices: readonly Invoice[],
  filters: InvoiceFilterParams
): Invoice[] {
  const { search, status, fromDate, toDate } = filters

  const normalizedSearch = search?.trim().toLowerCase()
  const fromTime = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null
  const toTime = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : null

  return invoices.filter((inv) => {
    // 1. Status filter
    if (status && status !== 'ALL' && inv.status !== status) {
      return false
    }

    // 2. Multi-field search
    if (normalizedSearch) {
      const matchNumber = inv.invoiceNumber.toLowerCase().includes(normalizedSearch)
      const matchCustomerName = inv.customer.name.toLowerCase().includes(normalizedSearch)
      const matchCompany = inv.customer.company.toLowerCase().includes(normalizedSearch)
      const matchEmail = (inv.customerEmail || inv.customer.email).toLowerCase().includes(normalizedSearch)
      const matchTracking = inv.trackingNumber?.toLowerCase().includes(normalizedSearch) ?? false

      if (!matchNumber && !matchCustomerName && !matchCompany && !matchEmail && !matchTracking) {
        return false
      }
    }

    // 3. Date range filter (based on invoice issueDate)
    if (fromTime !== null || toTime !== null) {
      const invoiceTime = new Date(`${inv.issueDate}T12:00:00`).getTime()

      if (fromTime !== null && !isNaN(fromTime) && invoiceTime < fromTime) {
        return false
      }

      if (toTime !== null && !isNaN(toTime) && invoiceTime > toTime) {
        return false
      }
    }

    return true
  })
}
