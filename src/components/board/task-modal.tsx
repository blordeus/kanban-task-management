import { ModalBackdrop } from "../ui/modal-backdrop";
import type { Task } from "../../types/board";
import ellipsis from "../../assets/icons/icon-vertical-ellipsis.svg";

type StatusOption = {
  value: string;
  label: string;
};

type TaskModalProps = {
  task: Task;
  statusOptions: StatusOption[];
  onClose: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onChangeStatus: (taskId: string, columnId: string) => void;
};

export function TaskModal({
  task,
  statusOptions,
  onClose,
  onToggleSubtask,
  onChangeStatus,
}: TaskModalProps) {
  const completedCount = task.subtasks.filter(
    (subtask) => subtask.isCompleted
  ).length;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-[480px] rounded-lg bg-[var(--surface)] px-6 py-6 text-[var(--text-primary)] shadow-[0_10px_20px_rgba(54,78,126,0.25)] md:px-8 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="pr-2 text-lg font-bold leading-[23px]">
            {task.title}
          </h2>

          <button
            type="button"
            aria-label="Open task actions"
            className="shrink-0 text-medium-grey transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
          >
            <img src={ellipsis} alt="" />
          </button>
        </div>

        {task.description ? (
          <p className="mt-6 text-[13px] font-medium leading-[23px] text-medium-grey">
            {task.description}
          </p>
        ) : null}

        <div className="mt-6">
          <h3 className="text-xs font-bold text-medium-grey">
            Subtasks ({completedCount} of {task.subtasks.length})
          </h3>

          <div className="mt-4 space-y-2">
            {task.subtasks.map((subtask) => (
              <label
                key={subtask.id}
                className="flex cursor-pointer items-center gap-4 rounded-md bg-[var(--surface-secondary)] px-3 py-3 transition hover:bg-purple/10"
              >
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={() => onToggleSubtask(task.id, subtask.id)}
                  className="h-4 w-4 rounded border border-[var(--border-color)] accent-purple"
                />
                <span
                  className={`text-xs font-bold ${
                    subtask.isCompleted
                      ? "text-medium-grey line-through"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {subtask.title}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="task-status"
            className="mb-2 block text-xs font-bold text-medium-grey"
          >
            Current Status
          </label>

          <select
            id="task-status"
            value={task.statusColumnId}
            onChange={(e) => onChangeStatus(task.id, e.target.value)}
            className="w-full rounded border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3 text-[13px] font-medium text-[var(--text-primary)] outline-none focus:border-purple"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ModalBackdrop>
  );
}