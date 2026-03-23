import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "icon";
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary: "bg-purple text-white hover:bg-purple-hover",
    secondary:
      "bg-purple/10 text-purple hover:bg-purple/20 dark:bg-white dark:text-purple dark:hover:bg-white/90",
    ghost: "bg-transparent text-medium-grey hover:text-purple",
    destructive: "bg-red text-white hover:bg-red-hover",
  };

  const sizes = {
    sm: "h-10 px-4 text-[13px]",
    md: "h-12 px-6 text-[15px]",
    icon: "h-12 w-12 p-0",
  };

  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}