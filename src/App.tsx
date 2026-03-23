import { useEffect, useMemo, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";
import type { Board, Column, Task } from "./types/board";
import { makeId } from "./utils/make-id";
import { STORAGE_KEYS } from "./utils/storage";
import type { EditableColumnInput } from "./components/board/add-edit-board-modal";

function findColumnByTaskId(board: Board, taskId: string) {
  return board.columns.find((column) =>
    column.tasks.some((task) => task.id === taskId),
  );
}

function findColumnByOverId(board: Board, overId: string) {
  return (
    board.columns.find((column) => column.id === overId) ||
    board.columns.find((column) =>
      column.tasks.some((task) => task.id === overId),
    )
  );
}

function App() {
  const [boards, setBoards] = useState<Board[]>(() => {
    const savedBoards = localStorage.getItem(STORAGE_KEYS.boards);

    if (!savedBoards) {
      return boardData.boards;
    }

    try {
      return JSON.parse(savedBoards) as Board[];
    } catch {
      return boardData.boards;
    }
  });

  const [activeBoardId, setActiveBoardId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.activeBoardId);
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);

  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.boards, JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    if (activeBoardId) {
      localStorage.setItem(STORAGE_KEYS.activeBoardId, activeBoardId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeBoardId);
    }
  }, [activeBoardId]);

  useEffect(() => {
    const syncLayout = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsSidebarOpen(isDesktop);

      if (isDesktop) {
        setIsMobileMenuOpen(false);
      }
    };

    syncLayout();
    window.addEventListener("resize", syncLayout);

    return () => window.removeEventListener("resize", syncLayout);
  }, []);

  const activeBoardIndex = useMemo(() => {
    if (!boards.length) return 0;

    const foundIndex = boards.findIndex((board) => board.id === activeBoardId);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [boards, activeBoardId]);

  const activeBoard = useMemo(
    () => boards[activeBoardIndex] ?? boards[0],
    [boards, activeBoardIndex],
  );

  const selectedTask = useMemo(() => {
    if (!activeBoard || !selectedTaskId) return null;

    for (const column of activeBoard.columns) {
      const foundTask = column.tasks.find((task) => task.id === selectedTaskId);
      if (foundTask) return foundTask;
    }

    return null;
  }, [activeBoard, selectedTaskId]);

  useEffect(() => {
    if (!boards.length) {
      setActiveBoardId(null);
      return;
    }

    if (!activeBoardId || !boards.some((board) => board.id === activeBoardId)) {
      setActiveBoardId(boards[0].id);
    }
  }, [boards, activeBoardId]);

  function handleClearSelectedTask() {
    setSelectedTaskId(null);
    setIsTaskModalOpen(false);
    setIsEditTaskOpen(false);
    setIsDeleteTaskOpen(false);
  }

  function handleOpenTaskModal(task: Task) {
    setSelectedTaskId(task.id);
    setIsTaskModalOpen(true);
  }

  function handleCloseTaskModal() {
    setIsTaskModalOpen(false);
  }

  function handleOpenEditTask() {
    setIsTaskModalOpen(false);
    setIsEditTaskOpen(true);
  }

  function handleCloseEditTask() {
    setIsEditTaskOpen(false);

    if (selectedTaskId) {
      setIsTaskModalOpen(true);
    }
  }

  function handleOpenDeleteTask() {
    setIsTaskModalOpen(false);
    setIsDeleteTaskOpen(true);
  }

  function handleCloseDeleteTask() {
    setIsDeleteTaskOpen(false);

    if (selectedTaskId) {
      setIsTaskModalOpen(true);
    }
  }

  function handleAddBoard(name: string, columnInputs: EditableColumnInput[]) {
    const cleanedColumns: Column[] = columnInputs
      .map((column) => column.name.trim())
      .filter(Boolean)
      .map((columnName) => ({
        id: makeId("column"),
        name: columnName,
        tasks: [],
      }));

    const newBoard: Board = {
      id: makeId("board"),
      name: name.trim(),
      columns: cleanedColumns,
    };

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
    setIsAddBoardOpen(false);
  }

  function handleEditBoard(
    name: string,
    nextColumnInputs: EditableColumnInput[],
  ) {
    if (!activeBoard) return;

    const trimmedName = name.trim();

    const nextColumns: Column[] = nextColumnInputs
      .map((input) => ({
        id: input.id,
        name: input.name.trim(),
      }))
      .filter((input) => input.name)
      .map((input) => {
        const existing = activeBoard.columns.find(
          (column) => column.id === input.id,
        );

        if (existing) {
          return {
            ...existing,
            name: input.name,
          };
        }

        return {
          id: makeId("column"),
          name: input.name,
          tasks: [],
        };
      });

    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoard.id
          ? {
              ...board,
              name: trimmedName,
              columns: nextColumns,
            }
          : board,
      ),
    );

    handleClearSelectedTask();
    setIsEditBoardOpen(false);
  }

  function handleDeleteBoard() {
    if (!activeBoard) return;

    setBoards((prev) => prev.filter((board) => board.id !== activeBoard.id));
    handleClearSelectedTask();
    setIsDeleteBoardOpen(false);
  }

  function handleAddTask(input: {
    title: string;
    description: string;
    statusColumnId: string;
    subtasks: { id: string; name: string }[];
  }) {
    if (!activeBoard) return;

    const newTask: Task = {
      id: makeId("task"),
      title: input.title.trim(),
      description: input.description.trim(),
      statusColumnId: input.statusColumnId,
      subtasks: input.subtasks
        .map((subtask) => ({
          id: subtask.id || makeId("subtask"),
          title: subtask.name.trim(),
          isCompleted: false,
        }))
        .filter((subtask) => subtask.title),
    };

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        return {
          ...board,
          columns: board.columns.map((column) =>
            column.id === input.statusColumnId
              ? { ...column, tasks: [...column.tasks, newTask] }
              : column,
          ),
        };
      }),
    );

    setIsAddTaskOpen(false);
  }

  function handleUpdateTask(input: {
    title: string;
    description: string;
    statusColumnId: string;
    subtasks: { id: string; name: string }[];
  }) {
    if (!activeBoard || !selectedTask) return;

    const updatedTask: Task = {
      ...selectedTask,
      title: input.title.trim(),
      description: input.description.trim(),
      statusColumnId: input.statusColumnId,
      subtasks: input.subtasks
        .map((subtask) => ({
          id: subtask.id || makeId("subtask"),
          title: subtask.name.trim(),
          isCompleted:
            selectedTask.subtasks.find((item) => item.id === subtask.id)
              ?.isCompleted ?? false,
        }))
        .filter((subtask) => subtask.title),
    };

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        const columnsWithoutTask = board.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== selectedTask.id),
        }));

        return {
          ...board,
          columns: columnsWithoutTask.map((column) =>
            column.id === updatedTask.statusColumnId
              ? { ...column, tasks: [...column.tasks, updatedTask] }
              : column,
          ),
        };
      }),
    );

    setIsEditTaskOpen(false);
    setIsTaskModalOpen(true);
  }

  function handleDeleteTask() {
    if (!activeBoard || !selectedTask) return;

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        return {
          ...board,
          columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== selectedTask.id),
          })),
        };
      }),
    );

    handleClearSelectedTask();
  }

  function handleToggleSubtask(taskId: string, subtaskId: string) {
    if (!activeBoard) return;

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        return {
          ...board,
          columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id !== taskId) return task;

              return {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, isCompleted: !subtask.isCompleted }
                    : subtask,
                ),
              };
            }),
          })),
        };
      }),
    );
  }

  function handleChangeTaskStatus(taskId: string, nextColumnId: string) {
    if (!activeBoard) return;

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        let movedTask: Task | null = null;

        const columnsWithoutTask = board.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => {
            if (task.id === taskId) {
              movedTask = {
                ...task,
                statusColumnId: nextColumnId,
              };
              return false;
            }
            return true;
          }),
        }));

        if (!movedTask) return board;

        return {
          ...board,
          columns: columnsWithoutTask.map((column) =>
            column.id === nextColumnId
              ? { ...column, tasks: [...column.tasks, movedTask as Task] }
              : column,
          ),
        };
      }),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!activeBoard || !over || active.id === over.id) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const sourceColumn = findColumnByTaskId(activeBoard, activeTaskId);
    const destinationColumn = findColumnByOverId(activeBoard, overId);

    if (!sourceColumn || !destinationColumn) return;

    if (sourceColumn.id === destinationColumn.id) {
      const oldIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === activeTaskId,
      );
      const newIndex =
        overId === destinationColumn.id
          ? destinationColumn.tasks.length - 1
          : destinationColumn.tasks.findIndex((task) => task.id === overId);

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

      setBoards((prev) =>
        prev.map((board) => {
          if (board.id !== activeBoard.id) return board;

          return {
            ...board,
            columns: board.columns.map((column) =>
              column.id === sourceColumn.id
                ? {
                    ...column,
                    tasks: arrayMove(column.tasks, oldIndex, newIndex),
                  }
                : column,
            ),
          };
        }),
      );

      return;
    }

    const movingTask = sourceColumn.tasks.find((task) => task.id === activeTaskId);
    if (!movingTask) return;

    const updatedTask: Task = {
      ...movingTask,
      statusColumnId: destinationColumn.id,
    };

    const destinationIndex =
      overId === destinationColumn.id
        ? destinationColumn.tasks.length
        : destinationColumn.tasks.findIndex((task) => task.id === overId);

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        return {
          ...board,
          columns: board.columns.map((column) => {
            if (column.id === sourceColumn.id) {
              return {
                ...column,
                tasks: column.tasks.filter((task) => task.id !== activeTaskId),
              };
            }

            if (column.id === destinationColumn.id) {
              const nextTasks = [...column.tasks];
              const insertIndex =
                destinationIndex < 0 ? nextTasks.length : destinationIndex;

              nextTasks.splice(insertIndex, 0, updatedTask);

              return {
                ...column,
                tasks: nextTasks,
              };
            }

            return column;
          }),
        };
      }),
    );
  }

  function handleOpenNewColumn() {
    setIsEditBoardOpen(true);
  }

  if (!activeBoard) return null;

  return (
    <AppShell
      boards={boards}
      activeBoardIndex={activeBoardIndex}
      activeBoardName={activeBoard.name}
      activeBoard={activeBoard}
      isSidebarOpen={isSidebarOpen}
      isMobileMenuOpen={isMobileMenuOpen}
      selectedTask={selectedTask}
      isTaskModalOpen={isTaskModalOpen}
      isAddTaskOpen={isAddTaskOpen}
      isEditTaskOpen={isEditTaskOpen}
      isDeleteTaskOpen={isDeleteTaskOpen}
      isAddBoardOpen={isAddBoardOpen}
      isEditBoardOpen={isEditBoardOpen}
      isDeleteBoardOpen={isDeleteBoardOpen}
      onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      onBoardChange={(index) => {
        const nextBoard = boards[index];

        if (nextBoard) {
          setActiveBoardId(nextBoard.id);
        }

        setIsMobileMenuOpen(false);
        handleClearSelectedTask();
      }}
      onHideSidebar={() => setIsSidebarOpen(false)}
      onShowSidebar={() => setIsSidebarOpen(true)}
      onCloseTaskModal={handleCloseTaskModal}
      onOpenAddTask={() => setIsAddTaskOpen(true)}
      onCloseAddTask={() => setIsAddTaskOpen(false)}
      onOpenEditTask={handleOpenEditTask}
      onCloseEditTask={handleCloseEditTask}
      onOpenDeleteTask={handleOpenDeleteTask}
      onCloseDeleteTask={handleCloseDeleteTask}
      onOpenAddBoard={() => setIsAddBoardOpen(true)}
      onCloseAddBoard={() => setIsAddBoardOpen(false)}
      onOpenEditBoard={() => setIsEditBoardOpen(true)}
      onCloseEditBoard={() => setIsEditBoardOpen(false)}
      onOpenDeleteBoard={() => setIsDeleteBoardOpen(true)}
      onCloseDeleteBoard={() => setIsDeleteBoardOpen(false)}
      onCreateBoard={handleAddBoard}
      onUpdateBoard={handleEditBoard}
      onCreateTask={handleAddTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onDeleteBoard={handleDeleteBoard}
      onOpenNewColumn={handleOpenNewColumn}
      onToggleSubtask={handleToggleSubtask}
      onChangeTaskStatus={handleChangeTaskStatus}
      theme={theme}
      onToggleTheme={() =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
      }
    >
      <BoardView
        board={activeBoard}
        onTaskClick={handleOpenTaskModal}
        onOpenNewColumn={handleOpenNewColumn}
        onDragEnd={handleDragEnd}
      />
    </AppShell>
  );
}

export default App;