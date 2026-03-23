type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function SelectField({ label, value, options, onChange }: Props) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-medium-grey">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-[13px] text-[var(--text-primary)] outline-none focus:border-purple"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}