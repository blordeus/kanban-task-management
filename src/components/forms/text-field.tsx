type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
}: TextFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-medium-grey">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded border px-4 py-2 text-[13px] outline-none transition ${
          error
            ? "border-red"
            : "border-[var(--border-color)] focus:border-purple"
        } bg-[var(--surface)] text-[var(--text-primary)]`}
      />

      {error && (
        <p className="mt-1 text-xs text-red">{error}</p>
      )}
    </div>
  );
}