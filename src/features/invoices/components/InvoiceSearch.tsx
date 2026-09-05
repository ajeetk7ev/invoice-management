import * as React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../../../components/ui/Input'

interface InvoiceSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function InvoiceSearch({
  value,
  onChange,
  placeholder = 'Search by invoice #, customer name, email, tracking...',
  className,
}: InvoiceSearchProps) {
  const [localValue, setLocalValue] = React.useState(value)
  const [prevValue, setPrevValue] = React.useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setLocalValue(value)
  }

  // Debounce the change callback by 300ms
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [localValue, onChange, value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={`relative flex-1 min-w-[240px] max-w-md ${className || ''}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 h-9 text-sm"
        aria-label="Search invoices"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded p-0.5"
          aria-label="Clear search input"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
