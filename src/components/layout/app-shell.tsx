import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";
import { SidebarToggle } from "./sidebar-toggle";
import { MobileBoardMenu } from "./mobile-board-menu";
import { TaskModal } from "../board/task-modal";
import type { Board, Task } from "../../types/board";

type AppShellProps = {
  boards: Board[];
  activeBoardIndex: number;
  activeBoardName: string;
  activeBoard: Board;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  selectedTask: Task | null;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  onBoardChange: (index: number) => void;
  onHideSidebar: () => void;
  onShowSidebar: () => void;
  onSelectTask: (task: Task | null) => void;
  onCloseTaskModal: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  children: ReactNode;
};

export function AppShell({
  boards,
  activeBoardIndex,
  activeBoardName,
  isSidebarOpen,
  isMobileMenuOpen,
  selectedTask,
  onToggleMobileMenu,
  onCloseMobileMenu,
  onBoardChange,
  onHideSidebar,
  onShowSidebar,
  onCloseTaskModal,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, onCloseMobileMenu]);

  useEffect(() => {
    setIsBoardMenuOpen(false);
  }, [activeBoardIndex, selectedTask]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        {isSidebarOpen && (
          <Sidebar
            boards={boards}
            activeBoardIndex={activeBoardIndex}
            onBoardChange={onBoardChange}
            onHideSidebar={onHideSidebar}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col bg-[var(--app-bg)]">
          <AppHeader
            boardName={activeBoardName}
            isSidebarOpen={isSidebarOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            isBoardMenuOpen={isBoardMenuOpen}
            onToggleMobileMenu={onToggleMobileMenu}
            onToggleBoardMenu={() =>
              setIsBoardMenuOpen((prev) => !prev)
            }
            onCloseBoardMenu={() => setIsBoardMenuOpen(false)}
          />
          <main className="min-w-0 flex-1 overflow-hidden bg-[var(--app-bg)]">
            {children}
          </main>
        </div>
      </div>

      {!isSidebarOpen && <SidebarToggle onShowSidebar={onShowSidebar} />}

      <MobileBoardMenu
        boards={boards}
        activeBoardIndex={activeBoardIndex}
        isOpen={isMobileMenuOpen}
        onClose={onCloseMobileMenu}
        onBoardChange={onBoardChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {selectedTask ? (
        <TaskModal task={selectedTask} onClose={onCloseTaskModal} />
      ) : null}
    </div>
  );
}