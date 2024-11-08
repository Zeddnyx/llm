import ToggleTheme from "./toggle-theme";

export default function Navbar() {
  return (
    <div className="w-full h-[66px] bg-background z-40 flex items-center justify-between fixed left-0 top-0 border-b border-neutral-500 contaier px-5">
      <ToggleTheme />
    </div>
  );
}
