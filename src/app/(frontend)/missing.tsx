import { notFound } from "next/navigation"
import { Suspense } from "react"
import NotFound from "./not-found"

// An unknown slug is prerendered at request time. notFound() at the top of the
// page fails the whole HTML shell: Next then answers 404 with an empty
// `__next_error__` document that only JS can fill. Thrown inside a Suspense
// boundary, it still sets the 404 status, and the boundary's fallback, the
// branded 404 page, stays in the HTML. After hydration the (frontend)
// not-found boundary takes over and shows the same page.
export function Missing() {
  return (
    <Suspense fallback={<NotFound />}>
      <Throw />
    </Suspense>
  )
}

function Throw(): never {
  notFound()
}
