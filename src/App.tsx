import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";

function App() {
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
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
    [activeBoardIndex]
  );

  return (
    <AppShell
      boards={boardData.boards}
      activeBoardIndex={activeBoardIndex}
      activeBoardName={activeBoard.name}
      isSidebarOpen={isSidebarOpen}
      isMobileMenuOpen={isMobileMenuOpen}
      onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      onBoardChange={(index) => {
        setActiveBoardIndex(index);
        setIsMobileMenuOpen(false);
      }}
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