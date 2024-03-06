import React, { useState } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
  };

  const toggleTheme = () => {
    setIsDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      if (newDarkMode) {
        setDarkMode();
      } else {
        setLightMode();
      }
      return newDarkMode;
    });
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
        checked={isDarkMode}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        {isDarkMode ?  <Sun /> :  <Moon />}
      </label>
    </div>
  );
};

export default DarkMode;
