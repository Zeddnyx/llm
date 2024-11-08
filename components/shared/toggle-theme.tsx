"use client";
import { useTheme } from "next-themes";
import { MdDarkMode } from "react-icons/md";
import { BsFillLightbulbFill } from "react-icons/bs";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const handleTheme = () => {
   if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button className="text-foreground" onClick={handleTheme}>
      {theme === "dark" ? (
        <BsFillLightbulbFill className="text-yellow-500" size={20} />
      ) : (
        <MdDarkMode size={20} />
      )}
    </button>
  );
}
