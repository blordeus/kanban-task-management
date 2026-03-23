import iconLightTheme from "../../assets/icons/icon-light-theme.svg";
import iconDarkTheme from "../../assets/icons/icon-dark-theme.svg";

type ThemeToggleProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <div className="rounded-md bg-light-grey px-6 py-4 dark:bg-very-dark-grey">
      <div className="flex items-center justify-center gap-6">
        <img src={iconLightTheme} alt="" />
        <button
          type="button"
          aria-label="Toggle theme"
          aria-pressed={isDark}
          onClick={onToggleTheme}
          className="flex h-5 w-10 items-center rounded-full bg-purple px-1 transition hover:bg-purple-hover"
        >
          <span
            className={`block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              isDark ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <img src={iconDarkTheme} alt="" />
      </div>
    </div>
  );
}