import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { buttonVariants } from "@/modules/ui/components/button"
import { cn } from "@/modules/ui/utils/tailwind"

type ButtonLinkProps = ComponentProps<"a"> & VariantProps<typeof buttonVariants>

// The shadcn Button for links: buttonVariants on a plain <a>, as shadcn's Base
// UI docs require (Button with render={<a />} would force role="button").
// Size and colour come from the variants only; className is for layout.
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
