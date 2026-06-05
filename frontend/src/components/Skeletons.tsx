export const TaskSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg animate-pulse bg-muted/40 h-15.5">
    <div className="h-4 w-4 rounded bg-muted" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
    </div>
    <div className="h-8 w-8 rounded bg-muted" />
  </div>
);
export const TaskListSkeleton = () => {
  return (
    <div className="animate-pulse space-y-3 p-4 min-h-200">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b pb-3"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16" />
        </div>
      ))}
    </div>
  );
};

export const UserListSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4 p-4 min-h-200">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
