"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, FilePenLine } from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-2 mt-6 w-full"
      >
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder={
                    updating ? "Update task..." : "What needs to be done?"
                  }
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

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
    </Form>
  );
}
