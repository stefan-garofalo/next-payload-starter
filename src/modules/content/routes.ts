// The page at "/" has the slug "home"; every other page lives at "/<slug>".
export const HOME_SLUG = "home"

export const pagePath = (slug: string) => (slug === HOME_SLUG ? "/" : `/${slug}`)

// With Cache Components a dynamic route must prerender at least one param, or
// the build fails. With nothing published the route prerenders this slug,
// which finds no document and renders the 404 page.
const PLACEHOLDER = "__placeholder__"
export const atLeastOneSlug = (slugs: string[]) =>
  (slugs.length > 0 ? slugs : [PLACEHOLDER]).map((slug) => ({ slug }))
