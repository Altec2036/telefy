import { Skeleton } from "@/components/dashboard/skeleton";

type ModuleSkeletonProps = {
  title: string;
  rows?: number;
};

export function ModuleSkeleton({ title, rows = 3 }: ModuleSkeletonProps) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 backdrop-blur-xl">
      <p className="mb-4 text-sm font-medium text-[var(--text-muted)]">{title}</p>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    </section>
  );
}
