import { describe, expect, it } from 'vitest'
import { hasPermission } from '../constants/permissions'

describe('Role-Based Access Control (RBAC) Permissions', () => {
  it('grants full administrative permissions to ADMIN role', () => {
    expect(hasPermission('ADMIN', 'invoice:view')).toBe(true)
    expect(hasPermission('ADMIN', 'invoice:download')).toBe(true)
    expect(hasPermission('ADMIN', 'invoice:create')).toBe(true)
    expect(hasPermission('ADMIN', 'invoice:edit')).toBe(true)
    expect(hasPermission('ADMIN', 'invoice:delete')).toBe(true)
    expect(hasPermission('ADMIN', 'invoice:mark_paid')).toBe(true)
    expect(hasPermission('ADMIN', 'invoice:export')).toBe(true)
  })

  it('allows ACCOUNTANT to create, edit, mark paid, and export, but strictly forbids deletion', () => {
    expect(hasPermission('ACCOUNTANT', 'invoice:view')).toBe(true)
    expect(hasPermission('ACCOUNTANT', 'invoice:download')).toBe(true)
    expect(hasPermission('ACCOUNTANT', 'invoice:create')).toBe(true)
    expect(hasPermission('ACCOUNTANT', 'invoice:edit')).toBe(true)
    expect(hasPermission('ACCOUNTANT', 'invoice:mark_paid')).toBe(true)
    expect(hasPermission('ACCOUNTANT', 'invoice:export')).toBe(true)
    // Deletion must be false
    expect(hasPermission('ACCOUNTANT', 'invoice:delete')).toBe(false)
  })

  it('restricts VIEWER to view and download only', () => {
    expect(hasPermission('VIEWER', 'invoice:view')).toBe(true)
    expect(hasPermission('VIEWER', 'invoice:download')).toBe(true)
    // All mutating / exporting actions must be false
    expect(hasPermission('VIEWER', 'invoice:create')).toBe(false)
    expect(hasPermission('VIEWER', 'invoice:edit')).toBe(false)
    expect(hasPermission('VIEWER', 'invoice:delete')).toBe(false)
    expect(hasPermission('VIEWER', 'invoice:mark_paid')).toBe(false)
    expect(hasPermission('VIEWER', 'invoice:export')).toBe(false)
  })
})
