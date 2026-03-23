import iconBoard from "../../assets/icons/icon-board.svg";
import { ThemeToggle } from "./theme-toggle";
import type { Board } from "../../types/board";
import { cn } from "../../utils/cn";

type MobileBoardMenuProps = {
  boards: Board[];
  activeBoardIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onBoardChange: (index: number) => void;
  onOpenAddBoard: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function MobileBoardMenu({
  boards,
  activeBoardIndex,
  isOpen,
  onClose,
  onBoardChange,
  onOpenAddBoard,
  theme,
  onToggleTheme,
}: MobileBoardMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose}>
      <div
        className="mx-4 mt-20 max-h-[calc(100vh-96px)] overflow-y-auto rounded-lg bg-[var(--surface)] py-4 shadow-[0_10px_20px_rgba(54,78,126,0.25)] md:mx-auto md:mt-24 md:w-[264px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
          All Boards ({boards.length})
        </div>

        <nav className="mt-[19px] pr-4">
          <ul className="space-y-[2px]">
            {boards.map((board, index) => {
              const isActive = index === activeBoardIndex;

              return (
                <li key={board.name}>
                  <button
                    type="button"
                    onClick={() => {
                      onBoardChange(index);
                      onClose();
                    }}
                    className={cn(
                      "flex h-12 w-full items-center gap-3 rounded-r-full px-6 text-left text-[15px] font-bold transition-colors",
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
                onClick={() => {
                  onOpenAddBoard();
                  onClose();
                }}
                className="flex h-12 w-full items-center gap-3 rounded-r-full px-6 text-left text-[15px] font-bold text-purple transition hover:bg-purple/10"
              >
                <img src={iconBoard} alt="" />
                <span>+ Create New Board</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="px-4 pb-4 pt-4">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      </div>
    </div>
  );
}