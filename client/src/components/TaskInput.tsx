"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Check, Plus, X } from "lucide-react";

// Latest Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useTasks } from "@/context/task-context";
import { cn } from "@/lib/utils";

const TaskInputSchema = yup
  .object({
    task: yup.string().required("Please! Enter a task"),
  })
  .required();

type TaskFormValues = yup.InferType<typeof TaskInputSchema>;

export default function TaskInput() {
  const { state, dispatch } = useTasks();
  const { editingId, tasks } = state;
  const taskToEdit = tasks.find((t) => t.id === editingId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: yupResolver(TaskInputSchema),
    defaultValues: { task: taskToEdit?.text || "" },
  });

  const onSubmit = (data: TaskFormValues) => {
    if (editingId) {
      dispatch({ type: "UPDATE_TASK", payload: data.task });
    } else {
      dispatch({ type: "ADD_TASK", payload: data.task });
    }
    reset();
  };

  const isEditing = !!editingId;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <FieldGroup className="flex flex-row gap-2 items-center relative">
        <Field className="" data-invalid={!!errors.task}>
          <FieldLabel className="sr-only">New Task</FieldLabel>

          <Input
            {...register("task")}
            placeholder="Enter a new task..."
            className="py-4"
          />

          <FieldError className="text-xs mt-0 absolute -bottom-5 left-2">
            {errors.task?.message}
          </FieldError>
        </Field>

        <div className="flex gap-2">
          {/* Cancel Button - only shows when editing */}
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => dispatch({ type: "START_EDIT", payload: null })}
              className="shrink-0"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          )}

          <Button
            type="submit"
            size="icon"
            className={cn(
              "shrink-0 transition-colors",
              isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600",
            )}
          >
            {isEditing ? (
              <Check className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
