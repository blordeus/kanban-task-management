import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";
import { SidebarToggle } from "./sidebar-toggle";
import type { Board } from "../../types/board";

type AppShellProps = {
  boards: Board[];
  activeBoardIndex: number;
  onBoardChange: (index: number) => void;
  children: ReactNode;
};

export function AppShell({
  boards,
  activeBoardIndex,
  onBoardChange,
  children,
}: AppShellProps) {
  const activeBoard = boards[activeBoardIndex];
  const isDesktopSidebarVisible = true;

  return (
    <div className="min-h-screen bg-light-grey text-black dark:bg-very-dark-grey dark:text-white">
      <div className="flex min-h-screen">
        <Sidebar
          boards={boards}
          activeBoardIndex={activeBoardIndex}
          onBoardChange={onBoardChange}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            boardName={activeBoard.name}
            isDesktopSidebarVisible={isDesktopSidebarVisible}
          />
          <main className="flex-1 overflow-x-auto">{children}</main>
        </div>
      </div>

      <SidebarToggle />
    </div>
  );
}