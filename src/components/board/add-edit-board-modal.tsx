import { useMemo, useState } from "react";
import { ModalBackdrop } from "../ui/modal-backdrop";
import { Button } from "../ui/button";
import { TextField } from "../forms/text-field";
import { DynamicInputList } from "../forms/dynamic-input-list";

export type EditableColumnInput = {
  id: string;
  name: string;
};

type Props = {
  mode: "add" | "edit";
  initialName?: string;
  initialColumns?: EditableColumnInput[];
  submitLabel: string;
  title: string;
  onClose: () => void;
  onSubmit: (name: string, columns: EditableColumnInput[]) => void;
};

export function AddEditBoardModal({
  initialName = "",
  initialColumns = [{ id: "", name: "" }],
  submitLabel,
  title,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);
  const [columns, setColumns] = useState<EditableColumnInput[]>(
    initialColumns.length > 0 ? initialColumns : [{ id: "", name: "" }],
  );
  const [nameError, setNameError] = useState("");

  const normalizedColumns = useMemo(
    () => (columns.length > 0 ? columns : [{ id: "", name: "" }]),
    [columns],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Can’t be empty");
      return;
    }

    setNameError("");
    onSubmit(name, normalizedColumns);
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
            label="Board Name"
            value={name}
            onChange={setName}
            placeholder="e.g. Web Design"
            error={nameError}
          />

          <DynamicInputList
            label="Columns"
            values={normalizedColumns}
            onChange={setColumns}
            addLabel="+ Add New Column"
          />

          <Button className="w-full" type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </ModalBackdrop>
  );
}
