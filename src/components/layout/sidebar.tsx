import logoDark from "../../assets/logos/logo-dark.svg";
import logoLight from "../../assets/logos/logo-light.svg";
import iconBoard from "../../assets/icons/icon-board.svg";
import iconHideSidebar from "../../assets/icons/icon-hide-sidebar.svg";
import { cn } from "../../utils/cn";
import type { Board } from "../../types/board";
import { ThemeToggle } from "./theme-toggle";

type SidebarProps = {
  boards: Board[];
  activeBoardIndex: number;
  onBoardChange: (index: number) => void;
  onHideSidebar: () => void;
  onOpenAddBoard: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function Sidebar({
  boards,
  activeBoardIndex,
  onBoardChange,
  onHideSidebar,
  onOpenAddBoard,
  theme,
  onToggleTheme,
}: SidebarProps) {
  return (
    <aside className="hidden h-screen w-[300px] shrink-0 flex-col border-r border-[var(--border-color)] bg-[var(--surface)] lg:flex xl:w-[300px]">
      <div className="px-8 pb-[54px] pt-8">
        {theme === "light" ? (
          <img src={logoDark} alt="Kanban" />
        ) : (
          <img src={logoLight} alt="Kanban" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="px-8 text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
          All Boards ({boards.length})
        </div>

        <nav className="mt-[19px] pr-6">
          <ul className="space-y-[2px]">
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
                        : "text-medium-grey hover:bg-purple/10 hover:text-purple",
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
                onClick={onOpenAddBoard}
                className="flex h-12 w-full items-center gap-4 rounded-r-full px-8 text-left text-[15px] font-bold text-purple transition hover:bg-purple/10"
              >
                <img src={iconBoard} alt="" />
                <span>+ Create New Board</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto px-4 pb-8">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

          <button
            type="button"
            onClick={onHideSidebar}
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
