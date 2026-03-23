import rawData from "./data.json";
import type { Board, BoardData, Column, Task, Subtask } from "../types/board";

function makeId(prefix: string, value: string, index: number) {
  return `${prefix}-${value.toLowerCase().replace(/\s+/g, "-")}-${index}`;
}

const normalizedBoards: Board[] = (rawData as BoardData).boards.map(
  (board, boardIndex) => ({
    id: makeId("board", board.name, boardIndex),
    name: board.name,
    columns: board.columns.map((column, columnIndex) => ({
      id: makeId("column", `${board.name}-${column.name}`, columnIndex),
      name: column.name,
      tasks: column.tasks.map((task, taskIndex) => ({
        id: makeId("task", `${column.name}-${task.title}`, taskIndex),
        title: task.title,
        description: task.description,
        status: task.status,
        subtasks: task.subtasks.map((subtask, subtaskIndex) => ({
          id: makeId("subtask", `${task.title}-${subtask.title}`, subtaskIndex),
          title: subtask.title,
          isCompleted: subtask.isCompleted,
        })),
      })) as Task[],
    })) as Column[],
  })
);

export const boardData: { boards: Board[] } = {
  boards: normalizedBoards,
};