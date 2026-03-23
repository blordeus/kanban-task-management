import iconShowSidebar from "../../assets/icons/icon-show-sidebar.svg";

type SidebarToggleProps = {
  onShowSidebar: () => void;
};

export function SidebarToggle({ onShowSidebar }: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onShowSidebar}
      aria-label="Show sidebar"
      className="fixed bottom-8 left-0 z-20 hidden h-12 w-14 items-center justify-center rounded-r-full bg-purple transition hover:bg-purple-hover lg:flex"
    >
      <img src={iconShowSidebar} alt="" />
    </button>
  );
}