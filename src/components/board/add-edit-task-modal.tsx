import { useMemo, useState } from "react";
import { ModalBackdrop } from "../ui/modal-backdrop";
import { Button } from "../ui/button";
import { TextField } from "../forms/text-field";
import { TextareaField } from "../forms/textarea-field";
import { SelectField } from "../forms/select-field";

type SubtaskInput = {
  id: string;
  name: string;
};

type StatusOption = {
  value: string;
  label: string;
};

type Props = {
  statusOptions: StatusOption[];
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    description: string;
    statusColumnId: string;
    subtasks: string[];
  }) => void;
};

export function AddEditTaskModal({
  statusOptions,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusColumnId, setStatusColumnId] = useState(statusOptions[0]?.value ?? "");
  const [subtasks, setSubtasks] = useState<SubtaskInput[]>([{ id: "", name: "" }]);
  const [titleError, setTitleError] = useState("");

  const normalizedSubtasks = useMemo(
    () => (subtasks.length > 0 ? subtasks : [{ id: "", name: "" }]),
    [subtasks]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Can’t be empty");
      return;
    }

    setTitleError("");

    onSubmit({
      title,
      description,
      statusColumnId: statusColumnId || statusOptions[0]?.value || "",
      subtasks: normalizedSubtasks.map((item) => item.name),
    });
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[480px] rounded-lg bg-[var(--surface)] px-6 py-6 md:px-8 md:py-8"
      >
        <h2 className="text-lg font-bold">Add New Task</h2>

        <div className="mt-6 space-y-6">
          <TextField
            label="Title"
            value={title}
            onChange={setTitle}
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
                    onClick={() =>
                      setSubtasks(normalizedSubtasks.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove subtask ${index + 1}`}
                    className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSubtasks([...normalizedSubtasks, { id: "", name: "" }])}
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
            Create Task
          </Button>
        </div>
      </form>
    </ModalBackdrop>
  );
}