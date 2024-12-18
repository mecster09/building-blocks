export type Task = {
  id: string;
  title: string;
  category: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
}

export type Category = {
  id: string;
  name: string;
} 