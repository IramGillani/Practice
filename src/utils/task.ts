import type { FilterStatus, SortOrder, Task } from "../types";

export const processedTasks = (
  tasks: Task[],
  filter: FilterStatus,
  sortOrder: SortOrder,
) => {
  let result = [...tasks];

  if (filter === "completed") result = result.filter((t) => t.completed);
  if (filter === "active") result = result.filter((t) => !t.completed);

  result.sort((a, b) => {
    const timeA = a.createdAt.getTime();
    const timeB = b.createdAt.getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  return result;
};
