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

export function transformDates(data: any): any {
  if (data === null || data === undefined || typeof data !== "object") {
    return data;
  }

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (
        (key === "createdAt" || key === "updatedAt") &&
        typeof value === "string"
      ) {
        data[key] = new Date(value);
      } else if (typeof value === "object") {
        transformDates(value);
      }
    }
  }
  return data;
}
