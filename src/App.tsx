import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";
import type { Board, Column, Task, Subtask } from "./types/board";
import { makeId } from "./utils/make-id";

function App() {
  const [boards, setBoards] = useState<Board[]>(boardData.boards);
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("kanban-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kanban-theme", theme);
  }, [theme]);

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

  const activeBoard = useMemo(
    () => boards[activeBoardIndex] ?? boards[0],
    [boards, activeBoardIndex]
  );

  function handleAddBoard(name: string, columnNames: string[]) {
    const cleanedColumns: Column[] = columnNames
      .map((column) => column.trim())
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

    setBoards((prev) => {
      const next = [...prev, newBoard];
      setActiveBoardIndex(next.length - 1);
      return next;
    });

    setIsAddBoardOpen(false);
  }

  function handleEditBoard(name: string, nextColumnInputs: string[]) {
    if (!activeBoard) return;

    const trimmedName = name.trim();
    const cleanedColumnNames = nextColumnInputs.map((item) => item.trim()).filter(Boolean);

    const nextColumns: Column[] = cleanedColumnNames.map((columnName) => {
      const existing = activeBoard.columns.find((column) => column.name === columnName);
      return existing ?? { id: makeId("column"), name: columnName, tasks: [] };
    });

    setBoards((prev) =>
      prev.map((board, index) =>
        index === activeBoardIndex
          ? {
              ...board,
              name: trimmedName,
              columns: nextColumns,
            }
          : board
      )
    );

    setSelectedTask(null);
    setIsEditBoardOpen(false);
  }

  function handleDeleteBoard() {
    setBoards((prev) => {
      const next = prev.filter((_, index) => index !== activeBoardIndex);
      const nextIndex = next.length === 0 ? 0 : Math.min(activeBoardIndex, next.length - 1);
      setActiveBoardIndex(nextIndex);
      return next;
    });

    setSelectedTask(null);
    setIsDeleteBoardOpen(false);
  }

  function handleAddTask(input: {
    title: string;
    description: string;
    status: string;
    subtasks: string[];
  }) {
    if (!activeBoard) return;

    const newTask: Task = {
      id: makeId("task"),
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      subtasks: input.subtasks
        .map((title) => title.trim())
        .filter(Boolean)
        .map<Subtask>((title) => ({
          id: makeId("subtask"),
          title,
          isCompleted: false,
        })),
    };

    setBoards((prev) =>
      prev.map((board, boardIndex) => {
        if (boardIndex !== activeBoardIndex) return board;

        return {
          ...board,
          columns: board.columns.map((column) =>
            column.name === input.status
              ? { ...column, tasks: [...column.tasks, newTask] }
              : column
          ),
        };
      })
    );

    setIsAddTaskOpen(false);
  }

  function handleToggleSubtask(taskId: string, subtaskId: string) {
    setBoards((prev) =>
      prev.map((board, boardIndex) => {
        if (boardIndex !== activeBoardIndex) return board;

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
                    : subtask
                ),
              };
            }),
          })),
        };
      })
    );

    setSelectedTask((prev) => {
      if (!prev || prev.id !== taskId) return prev;

      return {
        ...prev,
        subtasks: prev.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, isCompleted: !subtask.isCompleted }
            : subtask
        ),
      };
    });
  }

  function handleChangeTaskStatus(taskId: string, nextStatus: string) {
    if (!activeBoard) return;

    let updatedTask: Task | null = null;

    setBoards((prev) =>
      prev.map((board, boardIndex) => {
        if (boardIndex !== activeBoardIndex) return board;

        const extractedTasks: Task[] = [];

        const columnsWithoutTask = board.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => {
            if (task.id === taskId) {
              extractedTasks.push({ ...task, status: nextStatus });
              return false;
            }
            return true;
          }),
        }));

        updatedTask = extractedTasks[0] ?? null;

        if (!updatedTask) return board;

        return {
          ...board,
          columns: columnsWithoutTask.map((column) =>
            column.name === nextStatus
              ? { ...column, tasks: [...column.tasks, updatedTask as Task] }
              : column
          ),
        };
      })
    );

    if (updatedTask) {
      setSelectedTask(updatedTask);
    }
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
      isAddTaskOpen={isAddTaskOpen}
      isAddBoardOpen={isAddBoardOpen}
      isEditBoardOpen={isEditBoardOpen}
      isDeleteBoardOpen={isDeleteBoardOpen}
      onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      onBoardChange={(index) => {
        setActiveBoardIndex(index);
        setIsMobileMenuOpen(false);
        setSelectedTask(null);
      }}
      onHideSidebar={() => setIsSidebarOpen(false)}
      onShowSidebar={() => setIsSidebarOpen(true)}
      onSelectTask={setSelectedTask}
      onCloseTaskModal={() => setSelectedTask(null)}
      onOpenAddTask={() => setIsAddTaskOpen(true)}
      onCloseAddTask={() => setIsAddTaskOpen(false)}
      onOpenAddBoard={() => setIsAddBoardOpen(true)}
      onCloseAddBoard={() => setIsAddBoardOpen(false)}
      onOpenEditBoard={() => setIsEditBoardOpen(true)}
      onCloseEditBoard={() => setIsEditBoardOpen(false)}
      onOpenDeleteBoard={() => setIsDeleteBoardOpen(true)}
      onCloseDeleteBoard={() => setIsDeleteBoardOpen(false)}
      onCreateBoard={handleAddBoard}
      onUpdateBoard={handleEditBoard}
      onCreateTask={handleAddTask}
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
        onTaskClick={setSelectedTask}
        onOpenNewColumn={handleOpenNewColumn}
      />
    </AppShell>
  );
}

export default App;