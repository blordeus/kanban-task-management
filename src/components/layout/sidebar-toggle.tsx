import iconShowSidebar from "../../assets/icons/icon-show-sidebar.svg";

export function SidebarToggle() {
  return (
    <button
      type="button"
      aria-label="Show sidebar"
      className="fixed bottom-8 left-0 hidden h-12 w-14 items-center justify-center rounded-r-full bg-purple transition hover:bg-purple-hover lg:flex"
    >
      <img src={iconShowSidebar} alt="" />
    </button>
  );
}