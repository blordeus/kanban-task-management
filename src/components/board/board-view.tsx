import type { Board } from "../../types/board";
import { Column } from "./column";
import { EmptyBoard } from "./empty-board";

const dotColors = [
  "bg-cyan-400",
  "bg-purple",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-pink-400",
];

type BoardViewProps = {
  board: Board;
};

export function BoardView({ board }: BoardViewProps) {
  if (board.columns.length === 0) {
    return <EmptyBoard />;
  }

  return (
    <div className="overflow-x-auto p-6 md:p-8">
      <div className="flex min-w-max gap-6">
        {board.columns.map((column, index) => (
          <Column
            key={column.name}
            column={column}
            colorClass={dotColors[index % dotColors.length]}
          />
        ))}

        <button
          type="button"
          className="mt-10 flex min-h-[calc(100vh-220px)] w-[280px] shrink-0 items-center justify-center rounded-md bg-[#e9effa] text-2xl font-bold text-medium-grey transition hover:text-purple dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5"
        >
          + New Column
        </button>
      </div>
    </div>
  );
}