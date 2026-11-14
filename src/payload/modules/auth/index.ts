import type { Access, FieldAccess } from "payload"

type AccessMode =
  | "authenticated"
  | "adminOnly"
  | "adminOrEditor"
  | "selfOrAdmin"
  | "publicRead"
  | "public"

// Common access control functions for collections (can return boolean | Where)
export const access: Record<AccessMode, Access> = {
  // Only authenticated users
  authenticated: ({ req: { user } }) => Boolean(user),

  // Only admins
  adminOnly: ({ req: { user } }) => {
    if (!user) return false
    return user.role === ROLES.ADMIN
  },

  // Admins and editors
  adminOrEditor: ({ req: { user } }) => {
    if (!user) return false
    return user.role === ROLES.ADMIN || user.role === ROLES.EDITOR
  },

  // Users can access their own data, admins can access everything
  selfOrAdmin: ({ req: { user }, id }) => {
    if (!user) return false
    if (user.role === ROLES.ADMIN) return true
    if (id) return user.id === id
    return false
  },

  // Public read access
  publicRead: () => true,

  // Admins and editors read drafts; everyone else reads published data only
  public: ({ req: { user } }) => {
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.EDITOR) return true
    return {
      _status: { equals: "published" },
    }
  },
} as const

// Field access control functions (only return boolean)
export const fieldAccess: Record<string, FieldAccess> = {
  // Only authenticated users
  authenticated: ({ req: { user } }) => Boolean(user),

  // Only admins
  adminOnly: ({ req: { user } }) => {
    if (!user) return false
    return user.role === ROLES.ADMIN
  },

  // Admins and editors
  adminOrEditor: ({ req: { user } }) => {
    if (!user) return false
    return user.role === ROLES.ADMIN || user.role === ROLES.EDITOR
  },

  // Users can access their own data, admins can access everything
  selfOrAdmin: ({ req: { user }, id }) => {
    if (!user) return false
    if (user.role === ROLES.ADMIN) return true
    if (id) return user.id === id
    return false
  },

  // Public read access
  publicRead: () => true,
}

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  CONTRIBUTOR: "contributor",
} as const
