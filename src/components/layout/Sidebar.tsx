import { FileText, BarChart3, Users, Settings, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useInvoiceStore } from '../../features/invoices/store/invoice.store'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

export function Sidebar() {
  const isCollapsed = useInvoiceStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useInvoiceStore((state) => state.toggleSidebar)

  const navItems = [
    { label: 'Invoices', to: '/invoices', icon: FileText, badge: 'Live' },
    { label: 'Analytics', to: '/analytics', icon: BarChart3, disabled: true },
    { label: 'Customers', to: '/customers', icon: Users, disabled: true },
    { label: 'Settings', to: '/settings', icon: Settings, disabled: true },
  ]

  return (
    <aside
      className={cn(
        'relative border-r border-border bg-card/60 backdrop-blur-xs transition-all duration-300 flex flex-col justify-between shrink-0 hidden md:flex',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      <div>
        {/* Navigation list */}
        <div className="py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors select-none',
                    isActive && !item.disabled
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : item.disabled
                      ? 'text-muted-foreground/50 cursor-not-allowed'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
                onClick={(e) => {
                  if (item.disabled) e.preventDefault()
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                    {item.disabled && (
                      <span className="text-[10px] text-muted-foreground/60 uppercase">
                        Soon
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* Footer controls & Collapse Toggle */}
      <div className="p-3 border-t border-border space-y-2">
        {!isCollapsed && (
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <span>Logistics Support</span>
            </div>
            <p className="text-[11px] leading-tight">
              Direct billing SLA inquiry: <br />
              <span className="text-primary font-mono">ops@freightfox.ai</span>
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-2 text-xs">Collapse</span>}
        </Button>
      </div>
    </aside>
  )
}
