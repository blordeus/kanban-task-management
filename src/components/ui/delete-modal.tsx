import { ModalBackdrop } from "./modal-backdrop";
import { Button } from "./button";

type Props = {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteModal({
  title,
  description,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <ModalBackdrop onClose={onCancel}>
      <div className="w-full max-w-[480px] rounded-lg bg-[var(--surface)] px-6 py-6 md:px-8 md:py-8">
        <h2 className="text-lg font-bold text-red">{title}</h2>

        <p className="mt-4 text-[13px] text-medium-grey">
          {description}
        </p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row">
          <Button variant="destructive" className="w-full" onClick={onConfirm}>
            Delete
          </Button>

          <Button variant="secondary" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
}