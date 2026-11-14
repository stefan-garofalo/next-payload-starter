import type { Access, FieldAccess, PayloadRequest } from "payload";

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  CONTRIBUTOR: "contributor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

const roleOf = (req: PayloadRequest): Role | undefined => req.user?.role;

const isAdmin = (req: PayloadRequest): boolean => roleOf(req) === ROLES.ADMIN;

const isAdminOrEditor = (req: PayloadRequest): boolean => {
  const role = roleOf(req);
  return role === ROLES.ADMIN || role === ROLES.EDITOR;
};

const isAuthenticated = (req: PayloadRequest): boolean => req.user !== null;

// Admins and editors read drafts; everyone else reads published data only.
export const publishedScope = (role?: Role): true | { _status: { equals: "published" } } =>
  role === ROLES.ADMIN || role === ROLES.EDITOR ? true : { _status: { equals: "published" } };

// Collection access (may return a Where query).
export const access = {
  authenticated: ({ req }) => isAuthenticated(req),
  adminOnly: ({ req }) => isAdmin(req),
  adminOrEditor: ({ req }) => isAdminOrEditor(req),
  // Users read and update themselves; admins everyone.
  selfOrAdmin: ({ req, id }) =>
    isAdmin(req) || (req.user !== null && id !== undefined && req.user.id === id),
  publicRead: () => true,
  public: ({ req }) => publishedScope(roleOf(req)),
} satisfies Record<string, Access>;

// Field access (booleans only).
export const fieldAccess = {
  authenticated: ({ req }) => isAuthenticated(req),
  adminOnly: ({ req }) => isAdmin(req),
} satisfies Record<string, FieldAccess>;
