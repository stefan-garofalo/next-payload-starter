/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/style/noMagicNumbers: seconds */

import type { CollectionConfig } from "payload"
import { access, fieldAccess, ROLES } from "@/payload/modules/auth"

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "System",
    useAsTitle: "email",
    defaultColumns: ["email", "role", "createdAt"],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 60, // 60 days in seconds
    maxLoginAttempts: 10,
    lockTime: 1000 * 60 * 10, // 10 minutes
    verify: false, // Set to true if email verification is needed
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
    // Only admins can access admin panel for users
    admin: access.authenticated as any,
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
}
