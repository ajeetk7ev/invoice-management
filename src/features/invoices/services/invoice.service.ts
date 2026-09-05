import type {
  CreateInvoiceInput,
  Invoice,
  InvoiceFilterParams,
  InvoiceListResponse,
  InvoiceSortConfig,
  InvoiceStats,
  InvoiceStatus,
  LineItem,
  PaginationParams,
} from '../types/invoice.types'
import {
  calculateAmountDue,
  calculateInvoiceStats,
  calculateLineItemAmount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from '../utils/invoice-calculations'
import { filterInvoices } from '../utils/invoice-filters'
import { sortInvoices } from '../utils/invoice-sort'
import { INITIAL_MOCK_INVOICES } from './mock-invoices'

class InvoiceService {
  private invoices: Invoice[] = [...INITIAL_MOCK_INVOICES]
  private shouldSimulateError: boolean = false
  private minLatencyMs: number = 250
  private maxLatencyMs: number = 450

  /**
   * Simulates realistic network delay.
   */
  private async delay(): Promise<void> {
    const ms = Math.floor(Math.random() * (this.maxLatencyMs - this.minLatencyMs + 1)) + this.minLatencyMs
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Toggles simulated API network error for UI error state testing.
   */
  public setSimulateError(simulate: boolean): void {
    this.shouldSimulateError = simulate
  }

  public isSimulatingError(): boolean {
    return this.shouldSimulateError
  }

  /**
   * Resets mock data to the initial 85 seeded invoices.
   */
  public resetToDefault(): void {
    this.invoices = [...INITIAL_MOCK_INVOICES]
  }

  /**
   * Fetches paginated, filtered, and sorted invoices.
   */
  public async getInvoices(params: {
    filters?: InvoiceFilterParams
    sort?: InvoiceSortConfig
    pagination?: PaginationParams
  }): Promise<InvoiceListResponse> {
    await this.delay()

    if (this.shouldSimulateError) {
      throw new Error('Simulated network failure (503): Service temporarily unavailable. Please retry.')
    }

    const { filters = {}, sort = { field: 'issueDate', direction: 'desc' }, pagination = { page: 1, pageSize: 10 } } = params

    // 1. Filter
    const filtered = filterInvoices(this.invoices, filters)

    // 2. Sort
    const sorted = sortInvoices(filtered, sort)

    // 3. Paginate
    const totalItems = sorted.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pagination.pageSize))
    const currentPage = Math.min(Math.max(1, pagination.page), totalPages)
    const startIndex = (currentPage - 1) * pagination.pageSize
    const paginatedData = sorted.slice(startIndex, startIndex + pagination.pageSize)

    return {
      data: paginatedData,
      meta: {
        currentPage,
        pageSize: pagination.pageSize,
        totalPages,
        totalItems,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1,
      },
    }
  }

  /**
   * Fetches all filtered invoices without pagination (used for full CSV export).
   */
  public async getAllFilteredInvoices(
    filters?: InvoiceFilterParams,
    sort?: InvoiceSortConfig
  ): Promise<Invoice[]> {
    await this.delay()

    if (this.shouldSimulateError) {
      throw new Error('Simulated network failure (503): Unable to export invoices.')
    }

    const filtered = filterInvoices(this.invoices, filters || {})
    return sort ? sortInvoices(filtered, sort) : filtered
  }

  /**
   * Fetches a single invoice by its unique ID.
   */
  public async getInvoiceById(id: string): Promise<Invoice> {
    await this.delay()

    if (this.shouldSimulateError) {
      throw new Error('Simulated network failure (503): Unable to retrieve invoice details.')
    }

    const invoice = this.invoices.find((inv) => inv.id === id || inv.invoiceNumber === id)
    if (!invoice) {
      throw new Error(`Invoice with identifier "${id}" was not found in the system.`)
    }

    return { ...invoice }
  }

  /**
   * Aggregates real-time financial stats from all active invoices.
   */
  public async getInvoiceStats(): Promise<InvoiceStats> {
    await this.delay()

    if (this.shouldSimulateError) {
      throw new Error('Simulated network failure (503): Unable to compute dashboard statistics.')
    }

    return calculateInvoiceStats(this.invoices)
  }

  /**
   * Updates an invoice status (e.g. mark as PAID).
   */
  public async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    await this.delay()

    const index = this.invoices.findIndex((inv) => inv.id === id)
    if (index === -1) {
      throw new Error(`Invoice with ID "${id}" was not found.`)
    }

    const existing = this.invoices[index]
    let amountPaid = existing.amountPaid
    let amountDue = existing.amountDue

    if (status === 'PAID') {
      amountPaid = existing.total
      amountDue = 0
    } else if (status === 'PENDING' && existing.status === 'PAID') {
      amountPaid = 0
      amountDue = existing.total
    }

    const updated: Invoice = {
      ...existing,
      status,
      amountPaid,
      amountDue,
      updatedAt: new Date().toISOString(),
    }

    this.invoices[index] = updated
    return { ...updated }
  }

  /**
   * Bulk updates statuses for multiple invoices.
   */
  public async bulkUpdateStatus(ids: string[], status: InvoiceStatus): Promise<Invoice[]> {
    await this.delay()

    const idSet = new Set(ids)
    const updatedInvoices: Invoice[] = []

    this.invoices = this.invoices.map((inv) => {
      if (idSet.has(inv.id)) {
        const isPaid = status === 'PAID'
        const updated: Invoice = {
          ...inv,
          status,
          amountPaid: isPaid ? inv.total : inv.amountPaid,
          amountDue: isPaid ? 0 : inv.amountDue,
          updatedAt: new Date().toISOString(),
        }
        updatedInvoices.push(updated)
        return updated
      }
      return inv
    })

    return updatedInvoices
  }

  /**
   * Deletes an invoice by ID.
   */
  public async deleteInvoice(id: string): Promise<boolean> {
    await this.delay()

    const initialLength = this.invoices.length
    this.invoices = this.invoices.filter((inv) => inv.id !== id)

    if (this.invoices.length === initialLength) {
      throw new Error(`Invoice with ID "${id}" could not be found to delete.`)
    }

    return true
  }

  /**
   * Creates a new invoice with properly calculated totals.
   */
  public async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    await this.delay()

    const lineItems: LineItem[] = input.lineItems.map((item, idx) => {
      const amount = calculateLineItemAmount(item.quantity, item.unitPrice)
      return {
        id: `li-custom-${Date.now()}-${idx + 1}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate ?? 0.18,
        amount,
      }
    })

    const subtotal = calculateSubtotal(lineItems)
    const tax = calculateTax(lineItems)
    const total = calculateTotal(subtotal, tax)
    const status: InvoiceStatus = input.status || 'PENDING'
    const amountPaid = status === 'PAID' ? total : 0
    const amountDue = calculateAmountDue(total, amountPaid)

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: input.invoiceNumber,
      customer: {
        id: `cust-${Date.now()}`,
        ...input.customer,
      },
      customerEmail: input.customer.email,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      status,
      subtotal,
      tax,
      total,
      amountPaid,
      amountDue,
      currency: 'INR',
      lineItems,
      originHub: input.originHub || 'Central Transit Hub',
      destinationHub: input.destinationHub || 'Regional Logistics Distribution Center',
      trackingNumber: `FF-AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentTerms: input.paymentTerms || 'Net 30 Days',
      notes: input.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Prepend to top of list
    this.invoices.unshift(newInvoice)
    return { ...newInvoice }
  }
}

export const invoiceService = new InvoiceService()
