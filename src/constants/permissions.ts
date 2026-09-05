/**
 * Role-Based Access Control (RBAC) definitions
 * 
 * IMPORTANT: In production, frontend authorization is strictly for UI gating
 * and UX feedback. Absolute authorization must always be enforced server-side.
 */

export type UserRole = 'ADMIN' | 'ACCOUNTANT' | 'VIEWER'

export type AppPermission =
  | 'invoice:view'
  | 'invoice:download'
  | 'invoice:create'
  | 'invoice:edit'
  | 'invoice:delete'
  | 'invoice:mark_paid'
  | 'invoice:export'

export const ROLE_PERMISSIONS: Record<UserRole, readonly AppPermission[]> = {
  ADMIN: [
    'invoice:view',
    'invoice:download',
    'invoice:create',
    'invoice:edit',
    'invoice:delete',
    'invoice:mark_paid',
    'invoice:export',
  ],
  ACCOUNTANT: [
    'invoice:view',
    'invoice:download',
    'invoice:create',
    'invoice:edit',
    'invoice:mark_paid',
    'invoice:export',
  ],
  VIEWER: [
    'invoice:view',
    'invoice:download',
  ],
} as const

export function hasPermission(role: UserRole, permission: AppPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role]
  return allowed ? allowed.includes(permission) : false
}

export const AVAILABLE_ROLES: { role: UserRole; label: string; description: string }[] = [
  { role: 'ADMIN', label: 'Admin', description: 'Full access including delete & status changes' },
  { role: 'ACCOUNTANT', label: 'Accountant', description: 'Create, edit, export, mark paid (no delete)' },
  { role: 'VIEWER', label: 'Auditor / Viewer', description: 'Read-only access & PDF download' },
]
