import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function TaskSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border border-border rounded-lg bg-muted/40 h-15.5">
      <Skeleton className="h-4 w-4 rounded shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-8 w-8 rounded shrink-0" />
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3 p-4 min-h-200">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b pb-3"
        >
          <div className="flex items-center space-x-3 w-full">
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function UserListSkeleton() {
  return (
    <div className="space-y-4 p-4 min-h-200">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PricingSkeleton() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12 space-y-4 flex flex-col items-center">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-9 w-3/4 max-w-md" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="flex flex-col justify-between border-2 border-border"
          >
            <CardHeader className="pt-6 space-y-4">
              <Skeleton className="h-6 w-1/2" />

              <div className="flex items-baseline gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
              <Skeleton className="h-4 w-28 mb-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
