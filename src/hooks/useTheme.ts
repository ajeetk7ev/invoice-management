import { useEffect } from 'react'
import { useInvoiceStore } from '../features/invoices/store/invoice.store'

export function useTheme() {
  const theme = useInvoiceStore((state) => state.theme)
  const setTheme = useInvoiceStore((state) => state.setTheme)
  const toggleTheme = useInvoiceStore((state) => state.toggleTheme)

  useEffect(() => {
    // Initial sync with documentElement
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' }
}
