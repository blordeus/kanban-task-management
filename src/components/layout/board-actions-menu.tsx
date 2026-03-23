type BoardActionsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function BoardActionsMenu({
  isOpen,
  onClose,
}: BoardActionsMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close board actions menu"
        className="fixed inset-0 z-30"
        onClick={onClose}
      />

      <div className="absolute right-0 top-[calc(100%+16px)] z-40 w-48 rounded-lg bg-[var(--surface)] px-4 py-4 shadow-[0_10px_20px_rgba(54,78,126,0.25)]">
        <div className="flex flex-col items-start gap-4">
          <button
            type="button"
            className="text-[13px] font-medium text-medium-grey transition hover:text-purple"
          >
            Edit Board
          </button>

          <button
            type="button"
            className="text-[13px] font-medium text-red transition hover:opacity-80"
          >
            Delete Board
          </button>
        </div>
      </div>
    </>
  );
}