//Todos types
export type FilterStatus = "all" | "completed" | "active";
export type SortOrder = "newest" | "oldest";

export interface Task {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
export interface TaskState {
  tasks: Task[];
  filter: FilterStatus;
  sortOrder: SortOrder;
  editingId: string | null;
  isLoading: boolean;
  error: string | null;
}

//Auth types

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  // avatarUrl?: string;
  // role?: 'user' | 'admin';
}

import * as yup from "yup";

// export const authSchema = yup
//   .object({
//     name: yup.string().required("Name is required").min(2),
//     email: yup.string().email("Invalid email").required("Email is required"),
//     password: yup.string().required("Password is required").min(6),
//   })
//   .required();

// export type AuthFormValues = yup.InferType<typeof authSchema>;

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const signupSchema = loginSchema.shape({
  name: yup.string().required("Name is required").min(2),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type SignupFormValues = yup.InferType<typeof signupSchema>;
