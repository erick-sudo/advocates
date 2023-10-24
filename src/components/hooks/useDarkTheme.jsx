import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useDarkTheme() {
  const { darkMode } = useContext(AuthContext);
  return () => (darkMode ? "dark" : "light");
}
