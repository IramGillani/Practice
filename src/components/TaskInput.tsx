import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus } from "lucide-react";

const TaskInputSchema = yup
  .object({
    task: yup.string().required("Please! Enter a task"),
  })
  .required();

export default function TaskInput() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(TaskInputSchema),
    defaultValues: {},
  });
  const onSubmit = (data: yup.InferType<typeof TaskInputSchema>) =>
    console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mt-6">
      <div className="flex flex-col flex-1">
        <input
          {...register("task")}
          className={
            errors.task?.message
              ? "border border-red-500 rounded-lg focus:ring-0 outline-none"
              : "flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          }
        />
        {errors.task?.message && (
          <span className="text-red-500 text-xs">{errors.task?.message}</span>
        )}
      </div>

      <button
        type="submit"
        className={`bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors`}
      >
        <Plus size={20} />
      </button>
    </form>
  );
}
