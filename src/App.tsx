import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";
import type { Task } from "./types/board";

function App() {
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
    () => boardData.boards[activeBoardIndex],
    [activeBoardIndex],
  );

  return (
    <AppShell
      boards={boardData.boards}
      activeBoardIndex={activeBoardIndex}
      activeBoardName={activeBoard.name}
      activeBoard={activeBoard}
      isSidebarOpen={isSidebarOpen}
      isMobileMenuOpen={isMobileMenuOpen}
      selectedTask={selectedTask}
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
      theme={theme}
      onToggleTheme={() =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
      }
    >
      <BoardView board={activeBoard} onTaskClick={setSelectedTask} />
    </AppShell>
  );
}

export default App;
