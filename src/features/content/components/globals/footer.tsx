import { Suspense } from "react"
import { env } from "@/env"
import { getFooter } from "@/modules/content/readers"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-4 py-8 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
        <Suspense fallback={<p>{env.NEXT_PUBLIC_APP_NAME}</p>}>
          <FooterContent />
        </Suspense>
      </div>
    </footer>
  )
}

async function FooterContent() {
  const { note, links } = await getFooter()
  const items = (links ?? []).flatMap(({ link, id }) =>
    link?.label && link.href ? [{ id: id ?? link.href, label: link.label, href: link.href }] : []
  )
  return (
    <>
      <p>{note ?? env.NEXT_PUBLIC_APP_NAME}</p>
      {items.length > 0 ? (
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a className="hover:text-foreground" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
