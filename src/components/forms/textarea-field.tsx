type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-medium-grey">
        {label}
      </label>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-[13px] text-[var(--text-primary)] outline-none focus:border-purple"
      />
    </div>
  );
}