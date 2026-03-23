import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";
import { SidebarToggle } from "./sidebar-toggle";
import type { Board } from "../../types/board";

type AppShellProps = {
  boards: Board[];
  activeBoardIndex: number;
  activeBoardName: string;
  isSidebarOpen: boolean;
  onBoardChange: (index: number) => void;
  onHideSidebar: () => void;
  onShowSidebar: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  children: ReactNode;
};

export function AppShell({
  boards,
  activeBoardIndex,
  activeBoardName,
  isSidebarOpen,
  onBoardChange,
  onHideSidebar,
  onShowSidebar,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-light-grey text-black dark:bg-very-dark-grey dark:text-white">
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

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader boardName={activeBoardName} isSidebarOpen={isSidebarOpen} />
          <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
        </div>
      </div>

      {!isSidebarOpen && <SidebarToggle onShowSidebar={onShowSidebar} />}
    </div>
  );
}