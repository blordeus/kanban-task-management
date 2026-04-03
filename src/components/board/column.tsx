import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Column as ColumnType, Task } from "../../types/board";
import { TaskCard } from "./task-card";

type ColumnProps = {
  column: ColumnType;
  colorClass: string;
  onTaskClick: (task: Task) => void;
};

export function Column({ column, colorClass, onTaskClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <section className="w-[280px] shrink-0">
      <div className="mb-6 flex items-center gap-3">
        <span className={`h-[15px] w-[15px] rounded-full ${colorClass}`} />
        <h2 className="text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
          {column.name} ({column.tasks.length})
        </h2>
      </div>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className={`m-0 min-h-[24px] list-none space-y-5 rounded-md p-0 transition ${
            isOver ? "bg-purple/5" : ""
          }`}
        >
          {column.tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} onClick={onTaskClick} />
            </li>
          ))}

          {column.tasks.length === 0 ? (
            <li className="rounded-md border border-dashed border-[var(--border-color)] px-4 py-6 text-center text-xs font-bold text-medium-grey">
              Drop tasks here
            </li>
          ) : null}
        </ul>
      </SortableContext>
    </section>
  );
}
