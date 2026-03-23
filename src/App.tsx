import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";
import type { Board, Column, Task, Subtask } from "./types/board";
import { makeId } from "./utils/make-id";
import { STORAGE_KEYS } from "./utils/storage";
import type { EditableColumnInput } from "./components/board/add-edit-board-modal";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
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
    [boards, activeBoardIndex]
  );

  useEffect(() => {
    if (!boards.length) {
      setActiveBoardId(null);
      return;
    }

    if (!activeBoardId || !boards.some((board) => board.id === activeBoardId)) {
      setActiveBoardId(boards[0].id);
    }
  }, [boards, activeBoardId]);

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

  function handleEditBoard(name: string, nextColumnInputs: EditableColumnInput[]) {
    if (!activeBoard) return;

    const trimmedName = name.trim();

    const nextColumns: Column[] = nextColumnInputs
      .map((input) => ({
        id: input.id,
        name: input.name.trim(),
      }))
      .filter((input) => input.name)
      .map((input) => {
        const existing = activeBoard.columns.find((column) => column.id === input.id);

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
          : board
      )
    );

    setSelectedTask(null);
    setIsEditBoardOpen(false);
  }

  function handleDeleteBoard() {
    if (!activeBoard) return;

    setBoards((prev) => prev.filter((board) => board.id !== activeBoard.id));
    setSelectedTask(null);
    setIsDeleteBoardOpen(false);
  }

  function handleAddTask(input: {
    title: string;
    description: string;
    statusColumnId: string;
    subtasks: string[];
  }) {
    if (!activeBoard) return;

    const newTask: Task = {
      id: makeId("task"),
      title: input.title.trim(),
      description: input.description.trim(),
      statusColumnId: input.statusColumnId,
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
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        return {
          ...board,
          columns: board.columns.map((column) =>
            column.id === input.statusColumnId
              ? { ...column, tasks: [...column.tasks, newTask] }
              : column
          ),
        };
      })
    );

    setIsAddTaskOpen(false);
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

  function handleChangeTaskStatus(taskId: string, nextColumnId: string) {
    if (!activeBoard) return;

    let updatedTask: Task | null = null;

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== activeBoard.id) return board;

        const columnsWithoutTask = board.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => {
            if (task.id === taskId) {
              updatedTask = {
                ...task,
                statusColumnId: nextColumnId,
              };
              return false;
            }
            return true;
          }),
        }));

        if (!updatedTask) return board;

        return {
          ...board,
          columns: columnsWithoutTask.map((column) =>
            column.id === nextColumnId
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
        const nextBoard = boards[index];
        if (nextBoard) {
          setActiveBoardId(nextBoard.id);
        }
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