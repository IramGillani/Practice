import { useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Check, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "./ui/field";

import { useTask } from "@/context/TaskProvider";
import { taskService } from "@/api/taskApi";
import { cn } from "@/lib/utils";

const TaskInputSchema = yup
  .object({
    text: yup.string().required("Please! Enter a task"),
  })
  .required();

type TaskFormValues = yup.InferType<typeof TaskInputSchema>;

const TaskInput = forwardRef<HTMLInputElement, {}>((props, ref) => {
  const { state, dispatch } = useTask();
  const { editingId, tasks } = state;

  const taskToEdit = tasks.find((t) => t._id === editingId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    setFocus,
  } = useForm<TaskFormValues>({
    resolver: yupResolver(TaskInputSchema),
    defaultValues: { text: taskToEdit?.text || "" },
  });

  useEffect(() => {
    if (taskToEdit) {
      setValue("text", taskToEdit.text);
      setFocus("text");
    } else {
      reset({ text: "" });
    }
  }, [taskToEdit, setValue, reset, setFocus]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      let targetTaskId: string | null = null;

      if (editingId) {
        const updated = await taskService.update(editingId, {
          text: data.text,
        });

        dispatch({ type: "UPDATE_TASK", payload: updated });
        dispatch({ type: "START_EDIT", payload: null });
      } else {
        const newTask = await taskService.create(data.text);
        dispatch({ type: "ADD_TASK", payload: newTask });

        targetTaskId = newTask._id;
      }

      reset();

      toast.success(editingId ? "Task Updated..." : "Task Created...", {
        ...(!editingId && {
          duration: 5000,
          action: {
            label: "View Task",
            onClick: () => {
              if (targetTaskId) {
                dispatch({ type: "SET_LATEST_TASK", payload: targetTaskId });
              }
            },
          },
          classNames: {
            actionButton: "!bg-green-800/80 text-white hover:bg-red-700",
          },
        }),
      });
    } catch (error) {
      console.error("Submission failed:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to submit task.",
      });
    }
  };

  const isEditing = !!editingId;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <FieldGroup className="flex flex-row gap-2 items-center relative">
        <Field className="grow" data-invalid={!!errors.text}>
          <FieldLabel className="sr-only">New Task</FieldLabel>
          <Input
            {...register("text")}
            placeholder={isEditing ? "Edit task..." : "Enter a new task..."}
            className="py-4"
            disabled={isSubmitting}
          />
          <FieldError className="text-xs mt-0 absolute -bottom-5 left-2">
            {errors.text?.message}
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
});
export default TaskInput;
