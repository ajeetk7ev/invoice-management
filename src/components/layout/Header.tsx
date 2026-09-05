import { Moon, Sun, Shield, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AVAILABLE_ROLES, type UserRole } from '../../constants/permissions'
import { useInvoiceStore } from '../../features/invoices/store/invoice.store'
import { Button } from '../ui/Button'

export function Header() {
  const theme = useInvoiceStore((state) => state.theme)
  const toggleTheme = useInvoiceStore((state) => state.toggleTheme)
  const currentRole = useInvoiceStore((state) => state.currentRole)
  const setRole = useInvoiceStore((state) => state.setRole)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <Link to="/invoices" className="flex items-center gap-2 font-bold text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-primary leading-none">
                FREIGHTFOX
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Invoice Management
              </span>
            </div>
          </Link>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-3">
          {/* Role Switcher - Cleanly styled for both Light and Dark modes */}
          <div className="flex items-center gap-2 bg-muted/60 dark:bg-muted/40 px-2.5 py-1 rounded-md border border-border shadow-xs">
            <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-xs font-medium text-muted-foreground hidden md:inline">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="h-7 text-xs border-0 bg-transparent text-foreground dark:text-foreground font-semibold focus:outline-none focus:ring-0 cursor-pointer rounded pr-1"
              aria-label="Active role selector"
            >
              {AVAILABLE_ROLES.map((r) => (
                <option
                  key={r.role}
                  value={r.role}
                  className="bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100 py-1"
                >
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
