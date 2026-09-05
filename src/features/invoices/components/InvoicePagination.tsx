import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SlidersHorizontal } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import type { PaginationMeta } from '../types/invoice.types'

interface InvoicePaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const PRESET_PAGE_SIZES = [10, 20, 50, 100]

export function InvoicePagination({
  meta,
  onPageChange,
  onPageSizeChange,
}: InvoicePaginationProps) {
  const { currentPage, totalPages, totalItems, pageSize } = meta

  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customInput, setCustomInput] = useState(String(pageSize))

  if (totalItems === 0) return null

  const startRecord = (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalItems)

  // Generate page numbers window (e.g. 1, 2, 3, 4, 5)
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleSelectChange = (val: string) => {
    if (val === 'custom') {
      setCustomInput(String(pageSize))
      setIsCustomMode(true)
    } else {
      const num = parseInt(val, 10)
      if (!isNaN(num) && num > 0) {
        onPageSizeChange(num)
      }
    }
  }

  const handleApplyCustom = () => {
    const parsed = parseInt(customInput, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 500) {
      onPageSizeChange(parsed)
      setIsCustomMode(false)
    } else {
      alert('Please enter a valid page size between 1 and 500.')
    }
  }

  const isCurrentPageSizeCustom = !PRESET_PAGE_SIZES.includes(pageSize)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 text-xs text-muted-foreground">
      {/* Left side: Range context & page size */}
      <div className="flex flex-wrap items-center gap-3">
        <span>
          Showing <strong className="text-foreground">{startRecord}</strong> to{' '}
          <strong className="text-foreground">{endRecord}</strong> of{' '}
          <strong className="text-foreground">{totalItems}</strong> invoices
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="hidden sm:inline">Rows per page:</span>

          {isCustomMode ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="500"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyCustom()
                  if (e.key === 'Escape') setIsCustomMode(false)
                }}
                className="h-8 w-16 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
                placeholder="1-500"
                autoFocus
              />
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleApplyCustom}
                className="h-8 px-2.5 text-xs font-semibold"
              >
                Set
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCustomMode(false)}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                title="Cancel custom size"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Select
                value={pageSize}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="h-8 w-20 text-xs cursor-pointer"
                aria-label="Select rows per page"
              >
                {PRESET_PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
                {isCurrentPageSizeCustom && (
                  <option value={pageSize}>
                    {pageSize} (Custom)
                  </option>
                )}
                <option value="custom">Custom...</option>
              </Select>

              <button
                type="button"
                onClick={() => {
                  setCustomInput(String(pageSize))
                  setIsCustomMode(true)
                }}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Set custom rows per page"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="h-8 w-8"
          title="First page"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 w-8"
          title="Previous page"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Numbered Page Buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((num) => (
            <Button
              key={num}
              variant={num === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(num)}
              className={`h-8 w-8 p-0 text-xs font-medium ${
                num === currentPage ? 'pointer-events-none' : ''
              }`}
              aria-current={num === currentPage ? 'page' : undefined}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 w-8"
          title="Next page"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="h-8 w-8"
          title="Last page"
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
