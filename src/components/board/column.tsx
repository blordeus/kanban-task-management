import type { Column as ColumnType, Task } from "../../types/board";
import { TaskCard } from "./task-card";

type ColumnProps = {
  column: ColumnType;
  colorClass: string;
  onTaskClick: (task: Task) => void;
};

export function Column({ column, colorClass, onTaskClick }: ColumnProps) {
  return (
    <section className="w-[280px] shrink-0">
      <div className="mb-6 flex items-center gap-3">
        <span className={`h-[15px] w-[15px] rounded-full ${colorClass}`} />
        <h2 className="text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
          {column.name} ({column.tasks.length})
        </h2>
      </div>

      <div className="space-y-5">
        {column.tasks.map((task) => (
          <TaskCard key={task.title} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </section>
  );
}