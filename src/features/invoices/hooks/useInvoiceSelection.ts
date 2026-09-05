import { useCallback, useMemo } from 'react'
import { useInvoiceStore } from '../store/invoice.store'
import type { Invoice } from '../types/invoice.types'

export function useInvoiceSelection(visibleInvoices: readonly Invoice[] = []) {
  const selectedIds = useInvoiceStore((state) => state.selectedIds)
  const toggleSelectInvoice = useInvoiceStore((state) => state.toggleSelectInvoice)
  const selectAll = useInvoiceStore((state) => state.selectAll)
  const clearSelection = useInvoiceStore((state) => state.clearSelection)

  const visibleIds = useMemo(() => visibleInvoices.map((inv) => inv.id), [visibleInvoices])

  const selectedCount = selectedIds.length

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  )

  const isAllVisibleSelected = useMemo(() => {
    if (visibleIds.length === 0) return false
    return visibleIds.every((id) => selectedIds.includes(id))
  }, [visibleIds, selectedIds])

  const isSomeVisibleSelected = useMemo(() => {
    if (visibleIds.length === 0) return false
    return visibleIds.some((id) => selectedIds.includes(id)) && !isAllVisibleSelected
  }, [visibleIds, selectedIds, isAllVisibleSelected])

  const toggleSelectAllVisible = useCallback(() => {
    if (isAllVisibleSelected) {
      // Unselect all visible
      const newSelection = selectedIds.filter((id) => !visibleIds.includes(id))
      selectAll(newSelection)
    } else {
      // Select all visible
      const merged = Array.from(new Set([...selectedIds, ...visibleIds]))
      selectAll(merged)
    }
  }, [isAllVisibleSelected, selectedIds, visibleIds, selectAll])

  const getSelectedVisibleInvoices = useCallback((): Invoice[] => {
    return visibleInvoices.filter((inv) => selectedIds.includes(inv.id))
  }, [visibleInvoices, selectedIds])

  return {
    selectedIds,
    selectedCount,
    isSelected,
    isAllVisibleSelected,
    isSomeVisibleSelected,
    toggleSelectInvoice,
    toggleSelectAllVisible,
    clearSelection,
    getSelectedVisibleInvoices,
  }
}
