import { beforeEach, describe, expect, it } from 'vitest'
import { useInvoiceStore } from '../features/invoices/store/invoice.store'

describe('Invoice Zustand Store', () => {
  beforeEach(() => {
    useInvoiceStore.setState({
      selectedIds: [],
      currentRole: 'ADMIN',
      theme: 'light',
      isSidebarCollapsed: false,
      isSimulatingError: false,
    })
  })

  it('selects and deselects individual invoices correctly', () => {
    const { selectInvoice, deselectInvoice } = useInvoiceStore.getState()

    selectInvoice('inv-1')
    expect(useInvoiceStore.getState().selectedIds).toEqual(['inv-1'])

    // Selecting duplicate does not duplicate in array
    selectInvoice('inv-1')
    expect(useInvoiceStore.getState().selectedIds).toEqual(['inv-1'])

    selectInvoice('inv-2')
    expect(useInvoiceStore.getState().selectedIds).toEqual(['inv-1', 'inv-2'])

    deselectInvoice('inv-1')
    expect(useInvoiceStore.getState().selectedIds).toEqual(['inv-2'])
  })

  it('toggles selection of invoices', () => {
    const { toggleSelectInvoice } = useInvoiceStore.getState()

    toggleSelectInvoice('inv-10')
    expect(useInvoiceStore.getState().selectedIds).toContain('inv-10')

    toggleSelectInvoice('inv-10')
    expect(useInvoiceStore.getState().selectedIds).not.toContain('inv-10')
  })

  it('handles selectAll and clearSelection', () => {
    const { selectAll, clearSelection } = useInvoiceStore.getState()

    selectAll(['inv-1', 'inv-2', 'inv-3'])
    expect(useInvoiceStore.getState().selectedIds).toEqual(['inv-1', 'inv-2', 'inv-3'])

    clearSelection()
    expect(useInvoiceStore.getState().selectedIds).toEqual([])
  })

  it('switches user role correctly', () => {
    const { setRole } = useInvoiceStore.getState()

    setRole('ACCOUNTANT')
    expect(useInvoiceStore.getState().currentRole).toBe('ACCOUNTANT')

    setRole('VIEWER')
    expect(useInvoiceStore.getState().currentRole).toBe('VIEWER')
  })

  it('toggles theme between light and dark', () => {
    const { toggleTheme } = useInvoiceStore.getState()

    expect(useInvoiceStore.getState().theme).toBe('light')
    toggleTheme()
    expect(useInvoiceStore.getState().theme).toBe('dark')
    toggleTheme()
    expect(useInvoiceStore.getState().theme).toBe('light')
  })

  it('toggles simulated error state', () => {
    const { setSimulateError } = useInvoiceStore.getState()

    setSimulateError(true)
    expect(useInvoiceStore.getState().isSimulatingError).toBe(true)

    setSimulateError(false)
    expect(useInvoiceStore.getState().isSimulatingError).toBe(false)
  })
})
