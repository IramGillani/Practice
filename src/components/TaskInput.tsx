import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, FilePenLine } from "lucide-react";
import { useTasks } from "../context/TodoProvider";
import { useEffect } from "react";

const TaskInputSchema = yup
  .object({
    task: yup.string().required("Please! Enter a task"),
  })
  .required();

type FormData = yup.InferType<typeof TaskInputSchema>;

export default function TaskInput() {
  const { addTask, updating, input } = useTasks(); // input here is the text of the task being edited

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(TaskInputSchema),
  });

  useEffect(() => {
    if (updating) {
      setValue("task", input);
    }
  }, [updating, input, setValue]);

  const onSubmit = (data: FormData) => {
    addTask(data.task);
    reset(); // Clear the form after submission
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-2 mt-6 items-start"
    >
      <div className="flex flex-col flex-1">
        <input
          {...register("task")}
          placeholder={updating ? "Update task..." : "What needs to be done?"}
          className={`px-4 py-2 border rounded-lg outline-none transition-all ${
            errors.task
              ? "border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {errors.task && (
          <span className="text-red-500 text-xs mt-1 ml-1">
            {errors.task.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className={`p-2 rounded-lg transition-colors h-10.5 flex items-center justify-center ${
          updating
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {updating ? <FilePenLine size={20} /> : <Plus size={20} />}
      </button>
    </form>
  );
}
