import { useMemo, useState } from "react";
import { ModalBackdrop } from "../ui/modal-backdrop";
import { Button } from "../ui/button";
import { TextField } from "../forms/text-field";
import { TextareaField } from "../forms/textarea-field";
import { SelectField } from "../forms/select-field";
import { sanitizeInput } from "../../utils/validation";
import iconCross from "../../assets/icons/icon-cross.svg";

type SubtaskInput = {
  id: string;
  name: string;
};

type StatusOption = {
  value: string;
  label: string;
};

type Props = {
  title: string;
  submitLabel: string;
  initialTask?: {
    title: string;
    description: string;
    statusColumnId: string;
    subtasks: SubtaskInput[];
  };
  statusOptions: StatusOption[];
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    description: string;
    statusColumnId: string;
    subtasks: SubtaskInput[];
  }) => void;
};

export function AddEditTaskModal({
  title,
  submitLabel,
  initialTask,
  statusOptions,
  onClose,
  onSubmit,
}: Props) {
  const [taskTitle, setTaskTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [statusColumnId, setStatusColumnId] = useState(
    initialTask?.statusColumnId ?? statusOptions[0]?.value ?? ""
  );
  const [subtasks, setSubtasks] = useState<SubtaskInput[]>(
    initialTask?.subtasks.length
      ? initialTask.subtasks
      : [{ id: "", name: "" }]
  );
  const [titleError, setTitleError] = useState("");

  const normalizedSubtasks = useMemo(
    () => (subtasks.length > 0 ? subtasks : [{ id: "", name: "" }]),
    [subtasks]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setTitleError("Can’t be empty");
      return;
    }

    if (statusOptions.length === 0) {
      console.error("No status options available");
      return;
    }

    setTitleError("");

    onSubmit({
      title: sanitizeInput(taskTitle),
      description: sanitizeInput(description),
      statusColumnId: statusColumnId || statusOptions[0]?.value || "",
      subtasks: normalizedSubtasks.map(subtask => ({
        ...subtask,
        name: sanitizeInput(subtask.name)
      })).filter(subtask => subtask.name.trim() !== ""),
    });
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[480px] rounded-lg bg-[var(--surface)] px-6 py-6 md:px-8 md:py-8"
      >
        <h2 className="text-lg font-bold">{title}</h2>

        <div className="mt-6 space-y-6">
          <TextField
            label="Title"
            value={taskTitle}
            onChange={setTaskTitle}
            placeholder="e.g. Take coffee break"
            error={titleError}
          />

          <TextareaField
            label="Description"
            value={description}
            onChange={setDescription}
          />

          <div>
            <label className="mb-2 block text-xs font-bold text-medium-grey">
              Subtasks
            </label>

            <div className="space-y-3">
              {normalizedSubtasks.map((value, index) => (
                <div key={value.id || index} className="flex items-center gap-4">
                  <input
                    value={value.name}
                    onChange={(e) => {
                      const next = [...normalizedSubtasks];
                      next[index] = { ...next[index], name: e.target.value };
                      setSubtasks(next);
                    }}
                    aria-label={`Subtask ${index + 1}`}
                    className="flex-1 rounded border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-[13px] text-[var(--text-primary)] outline-none focus:border-purple"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const filtered = normalizedSubtasks.filter((_, i) => i !== index);
                      // Ensure at least one subtask remains, even if empty
                      setSubtasks(filtered.length > 0 ? filtered : [{ id: "", name: "" }]);
                    }}
                    aria-label={`Remove subtask ${index + 1}`}
                    className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
                  >
                    <img src={iconCross} alt="" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setSubtasks([...normalizedSubtasks, { id: "", name: "" }])
              }
              className="mt-3 w-full rounded-full bg-purple/10 py-2 text-[13px] font-bold text-purple hover:bg-purple/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
            >
              + Add New Subtask
            </button>
          </div>

          <SelectField
            label="Status"
            value={statusColumnId}
            options={statusOptions}
            onChange={setStatusColumnId}
          />

          <Button className="w-full" type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </ModalBackdrop>
  );
}