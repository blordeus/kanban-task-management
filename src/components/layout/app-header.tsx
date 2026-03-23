import logoMobile from "../../assets/logos/logo-mobile.svg";
import chevronDown from "../../assets/icons/icon-chevron-down.svg";
import chevronUp from "../../assets/icons/icon-chevron-up.svg";
import ellipsis from "../../assets/icons/icon-vertical-ellipsis.svg";
import addTaskMobile from "../../assets/icons/icon-add-task-mobile.svg";
import { Button } from "../ui/button";

type AppHeaderProps = {
  boardName: string;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
};

export function AppHeader({
  boardName,
  isSidebarOpen,
  isMobileMenuOpen,
  onToggleMobileMenu,
}: AppHeaderProps) {
  return (
    <header className="relative z-30 flex h-16 items-center justify-between border-b border-lines-light bg-white px-4 md:h-20 md:px-6 dark:border-lines-dark dark:bg-dark-grey lg:h-24 lg:px-8">
      <div className="flex items-center gap-4 lg:gap-6">
        {!isSidebarOpen && (
          <img src={logoMobile} alt="Kanban" className="hidden lg:block" />
        )}

        <div className="flex items-center gap-4">
          <img src={logoMobile} alt="Kanban" className="lg:hidden" />

          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="flex items-center gap-2 lg:pointer-events-none"
            aria-label="Toggle boards menu"
            aria-expanded={isMobileMenuOpen}
          >
            <h1 className="text-lg font-bold text-black md:text-2xl dark:text-white">
              {boardName}
            </h1>

            <img
              src={isMobileMenuOpen ? chevronUp : chevronDown}
              alt=""
              className="lg:hidden"
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button className="hidden md:inline-flex md:px-[18px]">
          + Add New Task
        </Button>

        <Button size="icon" className="md:hidden" aria-label="Add new task">
          <img src={addTaskMobile} alt="" />
        </Button>

        <button
          type="button"
          className="text-medium-grey transition hover:opacity-70"
          aria-label="Open board actions"
        >
          <img src={ellipsis} alt="" />
        </button>
      </div>
    </header>
  );
}