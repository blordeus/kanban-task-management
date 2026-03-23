import type { Task } from "../../types/board";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const completed = task.subtasks.filter((item) => item.isCompleted).length;
  const total = task.subtasks.length;

  return (
    <button
      type="button"
      className="w-full rounded-lg bg-white px-4 py-[23px] text-left shadow-[0_4px_6px_rgba(54,78,126,0.101545)] transition hover:text-purple dark:bg-dark-grey"
    >
      <h3 className="text-[18px] font-bold leading-[23px] text-black dark:text-white">
        {task.title}
      </h3>
      <p className="mt-2 text-xs font-bold text-medium-grey">
        {completed} of {total} subtasks
      </p>
    </button>
  );
}