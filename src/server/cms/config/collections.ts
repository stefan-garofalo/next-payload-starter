import { access } from "../access";

export const BASE_PAGE_CONFIG = {
  trash: true,
  defaultLimit: 100,
  versions: {
    drafts: {
      autosave: false,
    },
  },
  access: {
    read: access.public,
    create: access.adminOrEditor,
    update: access.authenticated,
    delete: access.adminOrEditor,
    readVersions: access.authenticated,
  },
} as const;
