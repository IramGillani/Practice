"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, FilePenLine } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useTasks } from "@/context/TodoProvider";

const TaskInputSchema = yup
  .object({
    task: yup.string().required("Please enter a task"),
  })
  .required();

type FormData = yup.InferType<typeof TaskInputSchema>;

export default function TaskInput() {
  const { addTask, updating, input: editingText } = useTasks();

  const form = useForm<FormData>({
    resolver: yupResolver(TaskInputSchema),
    defaultValues: {
      task: "",
    },
  });

  useEffect(() => {
    if (updating) {
      form.setValue("task", editingText);
    }
  }, [updating, editingText, form]);

  const onSubmit = (data: FormData) => {
    addTask(data.task);
    form.reset({ task: "" });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex items-start gap-2 mt-6 w-full"
    >
      <div className="flex-1 space-y-1">
        <Input
          placeholder={updating ? "Update task..." : "What needs to be done?"}
          className="h-10"
          {...form.register("task")}
        />

        {form.formState.errors.task && (
          <p className="text-red-500 text-xs">
            {form.formState.errors.task.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="icon"
        className={`shrink-0 h-10 w-10 transition-colors ${
          updating
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {updating ? (
          <FilePenLine className="h-5 w-5" />
        ) : (
          <Plus className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}
