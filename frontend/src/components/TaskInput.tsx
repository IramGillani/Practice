import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Check, Plus, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "./ui/field";
import { useTaskState, useTaskDispatch } from "@/context/TaskProvider";

import { taskService } from "@/api/taskApi";
import { cn } from "@/lib/utils";

const TaskInputSchema = yup
  .object({
    task: yup.string().required("Please! Enter a task"),
  })
  .required();

type TaskFormValues = yup.InferType<typeof TaskInputSchema>;

export default function TaskInput() {
  const { editingId, tasks } = useTaskState();
  const dispatch = useTaskDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskToEdit = tasks.find((t) => t.id === editingId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormValues>({
    resolver: yupResolver(TaskInputSchema),
    defaultValues: { task: taskToEdit?.text || "" },
  });

  useEffect(() => {
    if (taskToEdit) {
      setValue("task", taskToEdit.text);
    } else {
      reset({ task: "" });
    }
  }, [taskToEdit, setValue, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        const updated = await taskService.update(editingId, {
          text: data.task,
        });

        dispatch({ type: "UPDATE_TASK", payload: updated });
        dispatch({ type: "START_EDIT", payload: null });
      } else {
        const newTask = await taskService.create(data.task);

        dispatch({ type: "ADD_TASK", payload: newTask });
      }
      reset();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!editingId;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <FieldGroup className="flex flex-row gap-2 items-center relative">
        <Field className="grow" data-invalid={!!errors.task}>
          <FieldLabel className="sr-only">New Task</FieldLabel>
          <Input
            {...register("task")}
            placeholder={isEditing ? "Edit task..." : "Enter a new task..."}
            className="py-4"
            disabled={isSubmitting}
          />
          <FieldError className="text-xs mt-0 absolute -bottom-5 left-2">
            {errors.task?.message}
          </FieldError>
        </Field>

        <div className="flex gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => dispatch({ type: "START_EDIT", payload: null })}
              className="shrink-0"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          )}

          <Button
            type="submit"
            size="icon"
            disabled={isSubmitting}
            className={cn(
              "shrink-0 transition-colors",
              isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600",
            )}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isEditing ? (
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
