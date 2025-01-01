import { Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoMoon, IoSunnyOutline } from "react-icons/io5";

const DarkModeSwitch = () => {
  const [darkMode, setDarkMode] = useState(false);

  const updateLocalStorage = (themeMode?: "dark") => {
    if (themeMode) localStorage.setItem("theme", themeMode);
    else localStorage.removeItem("theme");
  };

  const enableDarkMode = () => {
    document.documentElement.classList.add("dark");
    updateLocalStorage("dark");
  };

  const disableDarkMode = () => {
    document.documentElement.classList.remove("dark");
    updateLocalStorage();
  };

  useEffect(() => {
    const result = localStorage.getItem("theme");
    if (result === "dark") {
      enableDarkMode();
      setDarkMode(true);
    }
  }, []);

  return (
    <Switch
      size="sm"
      color="success"
      startContent={<IoSunnyOutline />}
      endContent={<IoMoon />}
      isSelected={darkMode}
      onChange={(e) => {
        const { checked } = e.target;

        if (checked) {
          enableDarkMode();
        } else {
          disableDarkMode();
        }

        setDarkMode(checked);
      }}
    />
  );
};

export default DarkModeSwitch;
