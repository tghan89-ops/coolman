import { describe, it, expect } from 'vitest'
import {
  isAdminUser,
  isAdminRole,
  readOptionList,
  createOptionList,
  updateOptionList,
  deleteOptionList,
} from '../access/optionLists'

const admin = { collection: 'adminUsers', role: 'admin' }
const marketing = { collection: 'adminUsers', role: 'marketing' }
const contractor = { collection: 'contractors' }

// Minimal stub of the args Payload passes to an Access function.
const argsFor = (user: unknown) => ({ req: { user } }) as never

describe('isAdminUser', () => {
  it('is true for any admin-panel user (admin or marketing role)', () => {
    expect(isAdminUser(admin)).toBe(true)
    expect(isAdminUser(marketing)).toBe(true)
  })
  it('is false for contractors and anonymous', () => {
    expect(isAdminUser(contractor)).toBe(false)
    expect(isAdminUser(null)).toBe(false)
    expect(isAdminUser(undefined)).toBe(false)
  })
})

describe('isAdminRole', () => {
  it('is true only for the admin role', () => {
    expect(isAdminRole(admin)).toBe(true)
  })
  it('is false for marketing, contractors, anonymous', () => {
    expect(isAdminRole(marketing)).toBe(false)
    expect(isAdminRole(contractor)).toBe(false)
    expect(isAdminRole(null)).toBe(false)
  })
})

describe('option-list access functions', () => {
  it('read is public', () => {
    expect(readOptionList(argsFor(null))).toBe(true)
  })

  it('create is allowed for admin and marketing, denied for contractors/anon', () => {
    expect(createOptionList(argsFor(admin))).toBe(true)
    expect(createOptionList(argsFor(marketing))).toBe(true)
    expect(createOptionList(argsFor(contractor))).toBe(false)
    expect(createOptionList(argsFor(null))).toBe(false)
  })

  it('update is admin-only (marketing cannot rename in-use options)', () => {
    expect(updateOptionList(argsFor(admin))).toBe(true)
    expect(updateOptionList(argsFor(marketing))).toBe(false)
    expect(updateOptionList(argsFor(contractor))).toBe(false)
  })

  it('delete is admin-only', () => {
    expect(deleteOptionList(argsFor(admin))).toBe(true)
    expect(deleteOptionList(argsFor(marketing))).toBe(false)
    expect(deleteOptionList(argsFor(null))).toBe(false)
  })
})
