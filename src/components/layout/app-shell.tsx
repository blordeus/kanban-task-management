import { useEffect } from "react";
import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";
import { SidebarToggle } from "./sidebar-toggle";
import { MobileBoardMenu } from "./mobile-board-menu";
import type { Board } from "../../types/board";

type AppShellProps = {
  boards: Board[];
  activeBoardIndex: number;
  activeBoardName: string;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
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
  isMobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  onBoardChange,
  onHideSidebar,
  onShowSidebar,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
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
          <AppHeader
            boardName={activeBoardName}
            isSidebarOpen={isSidebarOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={onToggleMobileMenu}
          />
          <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
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
    </div>
  );
}