import type { CollectionConfig } from "payload";
import { access, fieldAccess, ROLES } from "@/server/cms/access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "System",
    useAsTitle: "email",
    defaultColumns: ["email", "role", "createdAt"],
  },
  auth: {
    // Sessions last 60 days (seconds); ten failed logins lock the account for 10 minutes (ms).
    tokenExpiration: 60 * 60 * 24 * 60,
    maxLoginAttempts: 10,
    lockTime: 1000 * 60 * 10,
    // Set to true to require email verification.
    verify: false,
    cookies: {
      secure: true,
      sameSite: "Strict",
    },
  },
  access: {
    // Only admins can read all users
    read: access.adminOnly,
    // Only admins can create users
    create: access.adminOnly,
    // Users can update their own profile, admins can update anyone
    update: access.selfOrAdmin,
    // Only admins can delete users
    delete: access.adminOnly,
    // Every signed-in user may open the admin panel.
    admin: ({ req }) => req.user !== null,
    // Only admins can unlock users
    unlock: access.adminOnly,
  },
  fields: [
    {
      name: "role",
      type: "select",
      options: Object.values(ROLES).map((role) => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role,
      })),
      required: true,
      defaultValue: ROLES.CONTRIBUTOR,
      access: {
        create: fieldAccess.adminOnly,
        update: fieldAccess.adminOnly,
        read: fieldAccess.authenticated,
      },
    },
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
  ],
};
