import type { Access } from 'payload'

// Option-list collections (materials, applications, categories, machineTiers) drive
// every catalogue filter and product dropdown. A rename or delete of an in-use option
// breaks search for everyone — so those are admin-only. Marketing staff may still ADD
// new options. (Outside Voice finding #8 / TODOS Group 7.)

type MaybeUser = { collection?: string; role?: string } | null | undefined

export function isAdminUser(user: MaybeUser): boolean {
  return user?.collection === 'adminUsers'
}

export function isAdminRole(user: MaybeUser): boolean {
  return user?.collection === 'adminUsers' && user?.role === 'admin'
}

// Anyone (public catalogue) can read option lists.
export const readOptionList: Access = () => true

// Any admin-panel user (admin OR marketing) can create new options.
export const createOptionList: Access = ({ req: { user } }) => isAdminUser(user as MaybeUser)

// Only Alan (admin role) can rename an existing option or delete one.
export const updateOptionList: Access = ({ req: { user } }) => isAdminRole(user as MaybeUser)
export const deleteOptionList: Access = ({ req: { user } }) => isAdminRole(user as MaybeUser)
