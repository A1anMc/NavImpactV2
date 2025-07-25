'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { VICTORIAN_FRAMEWORKS } from "@/types/projects"
import { sdgColors } from "@/lib/design-system"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        neutral: "border-transparent bg-neutral-100 text-neutral-800",
        impact: "border-transparent bg-impact-100 text-impact-800",
        success: "border-transparent bg-success-100 text-success-800",
        warning: "border-transparent bg-yellow-100 text-yellow-800",
        danger: "border-transparent bg-red-100 text-red-800",
        primary: "border-transparent bg-primary-100 text-primary-800",
        sdg: "border-transparent text-white font-medium",
        victorian: "border-transparent text-white font-medium",
      },
      size: {
        default: "h-6 px-2.5 py-0.5 text-xs",
        sm: "h-5 px-2 py-0.5 text-xs",
        md: "h-6 px-2.5 py-0.5 text-xs",
        lg: "h-7 px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  sdgCode?: string;
  victorianFramework?: keyof typeof VICTORIAN_FRAMEWORKS;
}

function Badge({ 
  className, 
  variant, 
  size, 
  sdgCode, 
  victorianFramework,
  children,
  ...props 
}: BadgeProps) {
  // Handle SDG badge styling
  if (variant === "sdg" && sdgCode) {
    const sdgColor = sdgColors[sdgCode as keyof typeof sdgColors];
    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        style={{ backgroundColor: sdgColor }}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Handle Victorian framework badge styling
  if (variant === "victorian" && victorianFramework) {
    const framework = VICTORIAN_FRAMEWORKS[victorianFramework];
    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        style={{ backgroundColor: framework.color }}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </div>
  )
}

export { Badge, badgeVariants }

// SDG Badge component
export const SDGBadge: React.FC<{
  sdgCode: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}> = ({ sdgCode, children, className, size = "md" }) => {
  const config = {
    variant: "sdg" as const,
    size,
  };

  return (
    <Badge
      variant={config.variant}
      size={size}
      sdgCode={sdgCode}
      className={className}
    >
      {children}
    </Badge>
  );
};

// Victorian Framework Badge component
export const VictorianFrameworkBadge: React.FC<{
  framework: keyof typeof VICTORIAN_FRAMEWORKS;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}> = ({ framework, children, className, size = "md" }) => {
  const config = {
    variant: "victorian" as const,
    size,
  };

  return (
    <Badge
      variant={config.variant}
      victorianFramework={framework}
      size={size}
      className={className}
    >
      {children}
    </Badge>
  );
};

// Status Badge component
interface StatusBadgeProps {
  status: 'active' | 'completed' | 'pending' | 'draft' | 'cancelled';
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  size = 'md',
  className,
}) => {
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Active' },
    completed: { variant: 'primary' as const, text: 'Completed' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    draft: { variant: 'neutral' as const, text: 'Draft' },
    cancelled: { variant: 'danger' as const, text: 'Cancelled' },
  };

  const config = statusConfig[status];
  const displayText = children || config.text;

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
    >
      {displayText}
    </Badge>
  );
}; 