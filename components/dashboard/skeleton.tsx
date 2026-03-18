import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-black/5 via-black/10 to-black/5 dark:from-white/5 dark:via-white/10 dark:to-white/5",
        className,
      )}
    />
  );
}
