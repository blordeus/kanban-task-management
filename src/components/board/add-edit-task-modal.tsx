import { useState } from "react";
import { ModalBackdrop } from "../ui/modal-backdrop";
import { Button } from "../ui/button";
import { TextField } from "../forms/text-field";
import { TextareaField } from "../forms/textarea-field";
import { SelectField } from "../forms/select-field";
import { DynamicInputList } from "../forms/dynamic-input-list";

type Props = {
  columns: string[];
  onClose: () => void;
};

export function AddEditTaskModal({ columns, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(columns[0] || "");
  const [subtasks, setSubtasks] = useState([""]);

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-[480px] rounded-lg bg-[var(--surface)] px-6 py-6 md:px-8 md:py-8">
        <h2 className="text-lg font-bold">Add New Task</h2>

        <div className="mt-6 space-y-6">
          <TextField
            label="Title"
            value={title}
            onChange={setTitle}
            placeholder="e.g. Take coffee break"
          />

          <TextareaField
            label="Description"
            value={description}
            onChange={setDescription}
          />

          <DynamicInputList
            label="Subtasks"
            values={subtasks}
            onChange={setSubtasks}
            addLabel="+ Add New Subtask"
          />

          <SelectField
            label="Status"
            value={status}
            options={columns}
            onChange={setStatus}
          />

          <Button className="w-full">Create Task</Button>
        </div>
      </div>
    </ModalBackdrop>
  );
}