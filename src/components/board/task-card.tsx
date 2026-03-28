import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/board";

type TaskCardProps = {
  task: Task;
  onClick: (task: Task) => void;
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const completed = task.subtasks.filter((item) => item.isCompleted).length;
  const total = task.subtasks.length;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Allow Enter and Space to open the task modal
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(task);
    }
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={() => onClick(task)}
      onKeyDown={handleKeyDown}
      aria-label={`Task: ${task.title}. ${completed} of ${total} subtasks completed. Press Enter to open details or use arrow keys to navigate.`}
      className={`w-full rounded-lg bg-[var(--surface)] px-4 py-[23px] text-left shadow-[0_4px_6px_rgba(54,78,126,0.101545)] transition hover:text-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple ${
        isDragging ? "opacity-60" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <h3 className="text-[18px] font-bold leading-[23px] text-[var(--text-primary)]">
        {task.title}
      </h3>
      <p className="mt-2 text-xs font-bold text-medium-grey">
        {completed} of {total} subtasks
      </p>
    </button>
  );
}