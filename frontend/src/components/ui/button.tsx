'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-250 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#0f766e] text-white shadow-sm hover:bg-[#fb6f5f] hover:translate-y-[-1px] hover:shadow-md",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
        outline:
          "border-2 border-[#0f766e] bg-transparent text-[#0f766e] hover:bg-[#0f766e] hover:text-white hover:translate-y-[-1px] hover:shadow-sm",
        secondary:
          "bg-[#334155] text-white shadow-sm hover:bg-[#334155]/80",
        ghost: "hover:bg-[#0f766e]/10 hover:text-[#0f766e]",
        link: "text-[#0f766e] underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-[#0f766e] to-[#fb6f5f] text-white shadow-sm hover:from-[#fb6f5f] hover:to-[#0f766e] hover:translate-y-[-1px] hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 