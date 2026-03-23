import logoMobile from "../../assets/logos/logo-mobile.svg";
import chevronDown from "../../assets/icons/icon-chevron-down.svg";
import ellipsis from "../../assets/icons/icon-vertical-ellipsis.svg";
import addTaskMobile from "../../assets/icons/icon-add-task-mobile.svg";
import { Button } from "../ui/button";

type AppHeaderProps = {
  boardName: string;
  isDesktopSidebarVisible: boolean;
};

export function AppHeader({
  boardName,
  isDesktopSidebarVisible,
}: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-lines-light bg-white px-4 md:h-20 md:px-6 dark:border-lines-dark dark:bg-dark-grey lg:h-[97px] lg:px-8">
      <div className="flex items-center gap-4">
        {!isDesktopSidebarVisible && (
          <img
            src={logoMobile}
            alt="Kanban"
            className="hidden lg:block"
          />
        )}

        <div className="flex items-center gap-2 lg:gap-4">
          <h1 className="text-lg font-bold text-black md:text-2xl dark:text-white">
            {boardName}
          </h1>
          <button
            className="lg:hidden"
            aria-label="Open board menu"
            type="button"
          >
            <img src={chevronDown} alt="" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button className="hidden md:inline-flex">+ Add New Task</Button>

        <Button
          className="h-12 w-12 p-0 md:hidden"
          aria-label="Add new task"
        >
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