import iconCross from "../../assets/icons/icon-cross.svg";

type Props = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel: string;
};

export function DynamicInputList({
  label,
  values,
  onChange,
  addLabel,
}: Props) {
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...values, ""]);
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-medium-grey">
        {label}
      </label>

      <div className="space-y-3">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              value={value}
              onChange={(e) => update(index, e.target.value)}
              aria-label={`${label} ${index + 1}`}
              className="flex-1 rounded border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-[13px] text-[var(--text-primary)] outline-none focus:border-purple"
            />

            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
              className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
            >
              <img src={iconCross} alt="" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 w-full rounded-full bg-purple/10 py-2 text-[13px] font-bold text-purple hover:bg-purple/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
      >
        {addLabel}
      </button>
    </div>
  );
}