import { GetTodosProps } from "../types";
import * as todoRepo from "../repositories/todoRepo";
import { AppError } from "../utils/customErrorHandler";
import { CreateTodoData,UpdateTodoProps,DeleteTodoProps } from "../types";
export const getTodos = async ({ userId, limit, skip }: GetTodosProps) => {
  const totalTasks = await todoRepo.countByUser(userId);

  const todos = await todoRepo.findByUser(userId, {
    limit,
    skip,
  });

  return {
    tasks: todos,
    hasMore: skip + todos.length < totalTasks,
  };
};

export const createTodo = async ({ text, userId }: CreateTodoData) => {
  if (!text?.trim()) {
    throw new AppError(400, "Must enter a task");
  }

  return todoRepo.create({
    text: text.trim(),
    userId,
  });
};

export const updateTodo = async ({
  todoId,
  userId,
  updates,
}: UpdateTodoProps) => {
 const todo = await todoRepo.updateById(
  todoId,
  userId,
  updates
);

  if (!todo) {
    throw new AppError(404, "Task not found");
  }

  return todo;
};

export const deleteTodo = async ({
  todoId,
  userId,
}: DeleteTodoProps) => {
  const todo = await todoRepo.deleteById(
    todoId,
    userId
  );

  if (!todo) {
    throw new AppError(404, "Task not found");
  }
};
