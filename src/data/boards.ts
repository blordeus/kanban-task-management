import rawData from "./data.json";
import type { Board, Column, Task, Subtask } from "../types/board";

type RawTask = {
  title: string;
  description: string;
  status: string;
  subtasks: { title: string; isCompleted: boolean }[];
};

type RawColumn = {
  name: string;
  tasks: RawTask[];
};

type RawBoard = {
  name: string;
  columns: RawColumn[];
};

type RawBoardData = {
  boards: RawBoard[];
};

function makeId(prefix: string, value: string, index: number) {
  return `${prefix}-${value.toLowerCase().replace(/\s+/g, "-")}-${index}`;
}

const normalizedBoards: Board[] = (rawData as RawBoardData).boards.map(
  (board, boardIndex) => {
    const columns: Column[] = board.columns.map((column, columnIndex) => ({
      id: makeId("column", `${board.name}-${column.name}`, columnIndex),
      name: column.name,
      tasks: [],
    }));

    const columnsByName = new Map(columns.map((column) => [column.name, column.id]));

    const populatedColumns: Column[] = board.columns.map((column, columnIndex) => {
      const columnId = columns[columnIndex].id;

      const tasks: Task[] = column.tasks.map((task, taskIndex) => ({
        id: makeId("task", `${column.name}-${task.title}`, taskIndex),
        title: task.title,
        description: task.description,
        statusColumnId: columnsByName.get(task.status) ?? columnId,
        subtasks: task.subtasks.map((subtask, subtaskIndex): Subtask => ({
          id: makeId("subtask", `${task.title}-${subtask.title}`, subtaskIndex),
          title: subtask.title,
          isCompleted: subtask.isCompleted,
        })),
      }));

      return {
        id: columnId,
        name: column.name,
        tasks,
      };
    });

    return {
      id: makeId("board", board.name, boardIndex),
      name: board.name,
      columns: populatedColumns,
    };
  }
);

export const boardData: { boards: Board[] } = {
  boards: normalizedBoards,
};