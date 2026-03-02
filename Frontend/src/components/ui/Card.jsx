import React from "react";
import { cn } from "../../lib/utils";

export const Card = ({
    className,
    children,
    padding = "md",
    hoverable = false,
    ...props
}) => {
    const paddings = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div
            className={cn(
                "bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden",
                hoverable && "transition-transform hover:-translate-y-1 hover:shadow-lg duration-300 cursor-pointer",
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
    <h3 className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
);

export const CardDescription = ({ className, ...props }) => (
    <p className={cn("text-sm text-[var(--muted-foreground)]", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
    <div className={cn("pt-0", className)} {...props} />
);

export const CardFooter = ({ className, ...props }) => (
    <div className={cn("flex items-center pt-4 mt-4 border-t border-[var(--border)]", className)} {...props} />
);
