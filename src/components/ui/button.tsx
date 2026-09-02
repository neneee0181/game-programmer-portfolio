import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/85",
        outline: "border border-white/20 bg-white/5 text-white hover:bg-white/10",
        ghost: "text-white/70 hover:bg-white/10 hover:text-white",
      },
      size: { default: "h-10 px-4", icon: "size-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
