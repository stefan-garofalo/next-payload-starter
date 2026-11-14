import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NotFoundPage } from "./not-found-page";

const Throw = (): never => notFound();

// An unknown slug is prerendered at request time. notFound() at the top of the
// page fails the whole HTML shell: Next then answers 404 with an empty
// `__next_error__` document that only JS can fill. Thrown inside a Suspense
// boundary, it still sets the 404 status, and the boundary's fallback, the
// 404 page, stays in the HTML.
export const Missing = () => (
  <Suspense fallback={<NotFoundPage />}>
    <Throw />
  </Suspense>
);
