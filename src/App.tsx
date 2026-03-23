import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";
import type { Board, Task } from "./types/board";

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
    const cleanedColumns = columnNames
      .map((column) => column.trim())
      .filter(Boolean)
      .map((name) => ({ name, tasks: [] }));

    const newBoard: Board = {
      name: name.trim(),
      columns: cleanedColumns,
    };

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardIndex(boards.length);
    setIsAddBoardOpen(false);
  }

  function handleEditBoard(name: string, columnNames: string[]) {
    if (!activeBoard) return;

    const nextColumns = columnNames
      .map((columnName) => columnName.trim())
      .filter(Boolean)
      .map((columnName) => {
        const existing = activeBoard.columns.find(
          (column) => column.name === columnName
        );

        return existing ?? { name: columnName, tasks: [] };
      });

    setBoards((prev) =>
      prev.map((board, index) =>
        index === activeBoardIndex
          ? {
              ...board,
              name: name.trim(),
              columns: nextColumns,
            }
          : board
      )
    );

    setIsEditBoardOpen(false);
  }

  function handleDeleteBoard() {
    setBoards((prev) => prev.filter((_, index) => index !== activeBoardIndex));
    setActiveBoardIndex(0);
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
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      subtasks: input.subtasks
        .map((title) => title.trim())
        .filter(Boolean)
        .map((title) => ({
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

  function handleOpenNewColumn() {
    setIsEditBoardOpen(true);
  }

  if (!activeBoard) {
    return null;
  }

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
      theme={theme}
      onToggleTheme={() =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
      }
    >
      <BoardView board={activeBoard} onTaskClick={setSelectedTask} onOpenNewColumn={handleOpenNewColumn} />
    </AppShell>
  );
}

export default App;