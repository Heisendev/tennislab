import * as React from "react";

type CardProps = React.ComponentProps<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div className={`border border-gray-400 bg-card text-card-foreground shadow-sm p-4 flex ${className}`} {...props} />;
}