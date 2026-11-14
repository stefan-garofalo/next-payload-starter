import RootLayout from "./(frontend)/layout"
import NotFound, { metadata as notFoundMetadata } from "./(frontend)/not-found"

// The app has two root layouts ((frontend) and (payload)), so an unmatched URL
// never reaches (frontend)/not-found.tsx. Next serves this page instead, as
// static HTML with status 404, inside the same site shell.
export const metadata = notFoundMetadata

export default function GlobalNotFound() {
  return (
    <RootLayout params={Promise.resolve({})}>
      <NotFound />
    </RootLayout>
  )
}
