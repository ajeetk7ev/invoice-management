import { create } from 'zustand'
import type { UserRole } from '../../../constants/permissions'
import { invoiceService } from '../services/invoice.service'

export type AppTheme = 'light' | 'dark'

interface InvoiceUIState {
  // Selection
  selectedIds: string[]
  selectInvoice: (id: string) => void
  deselectInvoice: (id: string) => void
  toggleSelectInvoice: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void

  // Role & Permissions
  currentRole: UserRole
  setRole: (role: UserRole) => void

  // UI & Theme
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
  toggleTheme: () => void
  isSidebarCollapsed: boolean
  toggleSidebar: () => void

  // Testing & Error simulation
  isSimulatingError: boolean
  setSimulateError: (enable: boolean) => void

  // Refresh trigger counter to signal hook refetch
  refreshKey: number
  triggerRefresh: () => void
}

export const useInvoiceStore = create<InvoiceUIState>((set) => ({
  selectedIds: [],
  selectInvoice: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id) ? state.selectedIds : [...state.selectedIds, id],
    })),
  deselectInvoice: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((item) => item !== id),
    })),
  toggleSelectInvoice: (id) =>
    set((state) => {
      const exists = state.selectedIds.includes(id)
      return {
        selectedIds: exists
          ? state.selectedIds.filter((item) => item !== id)
          : [...state.selectedIds, id],
      }
    }),
  selectAll: (ids) =>
    set(() => ({
      selectedIds: Array.from(new Set(ids)),
    })),
  clearSelection: () => set({ selectedIds: [] }),

  currentRole: 'ADMIN',
  setRole: (role) => set({ currentRole: role }),

  theme: (typeof window !== 'undefined' && localStorage.getItem('freightfox_theme') === 'dark') ? 'dark' : 'light',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('freightfox_theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    set({ theme })
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        localStorage.setItem('freightfox_theme', nextTheme)
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      return { theme: nextTheme }
    }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  isSimulatingError: false,
  setSimulateError: (enable) => {
    invoiceService.setSimulateError(enable)
    set({ isSimulatingError: enable })
  },

  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}))
