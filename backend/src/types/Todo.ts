export interface ITodo extends Document {
  text: string;
  completed: boolean;
  createdAt: Date;
}
