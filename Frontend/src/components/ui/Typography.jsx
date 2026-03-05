import React from "react";
import { cn } from "../../lib/utils";

export const Typography = ({
    variant = "body",
    as,
    className,
    children,
    ...props
}) => {
    const Component = as || (variant.startsWith("h") ? variant : "p");

    const variants = {
        h1: "text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]",
        h2: "text-3xl md:text-4xl font-semibold tracking-tight text-[var(--foreground)]",
        h3: "text-2xl md:text-3xl font-semibold tracking-tight text-[var(--foreground)]",
        h4: "text-xl md:text-2xl font-semibold tracking-tight text-[var(--foreground)]",
        body: "text-base md:text-lg leading-relaxed text-[var(--foreground)] opacity-90",
        lead: "text-xl md:text-2xl leading-relaxed text-[var(--muted-foreground)]",
        small: "text-sm font-medium leading-none text-[var(--muted-foreground)]",
    };

    return (
        <Component className={cn(variants[variant], className)} {...props}>
            {children}
        </Component>
    );
};
