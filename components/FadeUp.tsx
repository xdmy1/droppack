import type { ReactNode } from "react";

export function FadeUp({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: string;
}) {
  return <div className={className}>{children}</div>;
}
