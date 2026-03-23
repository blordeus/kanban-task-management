import logoDark from "../../assets/logos/logo-dark.svg";
import iconBoard from "../../assets/icons/icon-board.svg";
import iconLightTheme from "../../assets/icons/icon-light-theme.svg";
import iconDarkTheme from "../../assets/icons/icon-dark-theme.svg";
import iconHideSidebar from "../../assets/icons/icon-hide-sidebar.svg";
import { cn } from "../../utils/cn";
import type { Board } from "../../types/board";

type SidebarProps = {
  boards: Board[];
  activeBoardIndex: number;
  onBoardChange: (index: number) => void;
};

export function Sidebar({
  boards,
  activeBoardIndex,
  onBoardChange,
}: SidebarProps) {
  return (
    <aside className="hidden h-screen w-[300px] shrink-0 flex-col border-r border-lines-light bg-white dark:border-lines-dark dark:bg-dark-grey lg:flex">
      <div className="px-8 pb-14 pt-8">
        <img src={logoDark} alt="Kanban" className="dark:hidden" />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="px-8 text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
          All Boards ({boards.length})
        </div>

        <nav className="mt-5 pr-6">
          <ul className="space-y-1">
            {boards.map((board, index) => {
              const isActive = index === activeBoardIndex;

              return (
                <li key={board.name}>
                  <button
                    type="button"
                    onClick={() => onBoardChange(index)}
                    className={cn(
                      "flex h-12 w-full items-center gap-4 rounded-r-full px-8 text-left text-[15px] font-bold transition-colors",
                      isActive
                        ? "bg-purple text-white"
                        : "text-medium-grey hover:bg-purple/10 hover:text-purple"
                    )}
                  >
                    <img
                      src={iconBoard}
                      alt=""
                      className={isActive ? "brightness-0 invert" : ""}
                    />
                    <span>{board.name}</span>
                  </button>
                </li>
              );
            })}

            <li>
              <button
                type="button"
                className="flex h-12 w-full items-center gap-4 rounded-r-full px-8 text-left text-[15px] font-bold text-purple transition hover:bg-purple/10"
              >
                <img src={iconBoard} alt="" />
                <span>+ Create New Board</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto px-4 pb-8">
          <div className="rounded-md bg-light-grey px-6 py-4 dark:bg-very-dark-grey">
            <div className="flex items-center justify-center gap-6">
              <img src={iconLightTheme} alt="" />
              <button
                type="button"
                aria-label="Toggle theme"
                className="flex h-5 w-10 items-center rounded-full bg-purple px-1"
              >
                <span className="block h-3.5 w-3.5 rounded-full bg-white" />
              </button>
              <img src={iconDarkTheme} alt="" />
            </div>
          </div>

          <button
            type="button"
            className="mt-4 flex items-center gap-4 px-4 py-3 text-[15px] font-bold text-medium-grey transition hover:text-purple"
          >
            <img src={iconHideSidebar} alt="" />
            <span>Hide Sidebar</span>
          </button>
        </div>
      </div>
    </aside>
  );
}