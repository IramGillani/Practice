import { Schema, model, Document } from "mongoose";
import { ITodo } from "../types";
export interface ITodoDocument extends ITodo, Document {}

const todoSchema = new Schema<ITodoDocument>(
  {
    text: {
      type: String,
      required: [true, "Task is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    //   versionKey: false,
    //   transform: (_, ret: any) => {
    //     ret.id = ret._id.toString();
    //     delete ret._id;
    //     return ret;
    //   },
    // },
  },
);

export default model<ITodoDocument>("Todo", todoSchema);
