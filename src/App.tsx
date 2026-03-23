import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";

function App() {
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const activeBoard = useMemo(
    () => boardData.boards[activeBoardIndex],
    [activeBoardIndex]
  );

  return (
    <AppShell
      boards={boardData.boards}
      activeBoardIndex={activeBoardIndex}
      activeBoardName={activeBoard.name}
      isSidebarOpen={isSidebarOpen}
      onBoardChange={setActiveBoardIndex}
      onHideSidebar={() => setIsSidebarOpen(false)}
      onShowSidebar={() => setIsSidebarOpen(true)}
      theme={theme}
      onToggleTheme={() =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
      }
    >
      <BoardView board={activeBoard} />
    </AppShell>
  );
}

export default App;