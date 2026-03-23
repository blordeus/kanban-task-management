import { useState } from "react";
import { ModalBackdrop } from "../ui/modal-backdrop";
import { Button } from "../ui/button";
import { TextField } from "../forms/text-field";
import { DynamicInputList } from "../forms/dynamic-input-list";

type Props = {
  onClose: () => void;
};

export function AddEditBoardModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState([""]);

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-[480px] rounded-lg bg-[var(--surface)] px-6 py-6 md:px-8 md:py-8">
        <h2 className="text-lg font-bold">Add New Board</h2>

        <div className="mt-6 space-y-6">
          <TextField
            label="Board Name"
            value={name}
            onChange={setName}
            placeholder="e.g. Web Design"
          />

          <DynamicInputList
            label="Columns"
            values={columns}
            onChange={setColumns}
            addLabel="+ Add New Column"
          />

          <Button className="w-full">Create New Board</Button>
        </div>
      </div>
    </ModalBackdrop>
  );
}