import logoMobile from "../../assets/logos/logo-mobile.svg";
import chevronDown from "../../assets/icons/icon-chevron-down.svg";
import chevronUp from "../../assets/icons/icon-chevron-up.svg";
import ellipsis from "../../assets/icons/icon-vertical-ellipsis.svg";
import addTaskMobile from "../../assets/icons/icon-add-task-mobile.svg";
import { Button } from "../ui/button";
import { BoardActionsMenu } from "./board-actions-menu";

type AppHeaderProps = {
  boardName: string;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isBoardMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onToggleBoardMenu: () => void;
  onCloseBoardMenu: () => void;
  onOpenAddTask: () => void;
};

export function AppHeader({
  boardName,
  isSidebarOpen,
  isMobileMenuOpen,
  isBoardMenuOpen,
  onToggleMobileMenu,
  onToggleBoardMenu,
  onCloseBoardMenu,
  onOpenAddTask,
}: AppHeaderProps) {
  return (
    <header className="relative z-30 flex h-16 items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface)] px-4 md:h-20 md:px-6 lg:h-24 lg:px-8">
      <div className="flex min-w-0 items-center gap-4 lg:gap-6">
        {!isSidebarOpen && (
          <img src={logoMobile} alt="Kanban" className="hidden lg:block" />
        )}

        <div className="flex min-w-0 items-center gap-4">
          <img src={logoMobile} alt="Kanban" className="lg:hidden" />

          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="flex min-w-0 items-center gap-2 lg:pointer-events-none"
            aria-label="Toggle boards menu"
            aria-expanded={isMobileMenuOpen}
          >
            <h1 className="truncate text-lg font-bold text-[var(--text-primary)] md:text-2xl">
              {boardName}
            </h1>

            <img
              src={isMobileMenuOpen ? chevronUp : chevronDown}
              alt=""
              className="shrink-0 lg:hidden"
            />
          </button>
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-4">
        <Button onClick={onOpenAddTask}>+ Add New Task</Button>

        <Button size="icon" className="md:hidden" aria-label="Add new task">
          <img src={addTaskMobile} alt="" />
        </Button>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleBoardMenu}
            className="shrink-0 text-medium-grey transition hover:opacity-70"
            aria-label="Open board actions"
            aria-expanded={isBoardMenuOpen}
          >
            <img src={ellipsis} alt="" />
          </button>

          <BoardActionsMenu
            isOpen={isBoardMenuOpen}
            onClose={onCloseBoardMenu}
          />
        </div>
      </div>
    </header>
  );
}