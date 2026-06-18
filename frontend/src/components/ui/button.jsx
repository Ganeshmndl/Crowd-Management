import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-brand-600 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-brand-700",
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
        white: "bg-white text-brand-700 shadow-lg hover:-translate-y-0.5 hover:bg-blue-50",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
