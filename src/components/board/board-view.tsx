import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Board, Task } from "../../types/board";
import { Column } from "./column";
import { EmptyBoard } from "./empty-board";

const dotColors = [
  "bg-cyan-400",
  "bg-violet-500",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-pink-400",
];

type BoardViewProps = {
  board: Board;
  onTaskClick: (task: Task) => void;
  onOpenNewColumn: () => void;
  onDragEnd: (event: DragEndEvent) => void;
};

export function BoardView({
  board,
  onTaskClick,
  onOpenNewColumn,
  onDragEnd,
}: BoardViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 6,
      },
    }),
  );

  if (board.columns.length === 0) {
    return <EmptyBoard onOpenNewColumn={onOpenNewColumn} />;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="h-full overflow-x-auto overflow-y-hidden px-4 pb-6 pt-6 md:px-6 md:pb-8 lg:px-6 lg:pt-6">
        <div className="flex h-full min-w-max gap-6">
          {board.columns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              colorClass={dotColors[index % dotColors.length]}
              onTaskClick={onTaskClick}
            />
          ))}

          <button
            type="button"
            onClick={onOpenNewColumn}
            className="mt-10 flex h-[calc(100%-40px)] min-h-[700px] w-[280px] shrink-0 items-center justify-center rounded-md bg-[image:var(--new-column-bg)] text-2xl font-bold text-medium-grey transition hover:text-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
          >
            + New Column
          </button>
        </div>
      </div>
    </DndContext>
  );
}