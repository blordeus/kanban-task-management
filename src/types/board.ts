export type Subtask = {
  title: string;
  isCompleted: boolean;
};

export type Task = {
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
};

export type Column = {
  name: string;
  tasks: Task[];
};

export type Board = {
  name: string;
  columns: Column[];
};

export type BoardData = {
  boards: Board[];
};