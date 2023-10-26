import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function Expired({ onCancel = () => {}, onLogin = () => {} }) {
  const { darkMode } = useContext(AuthContext);

  return (
    <div className={`fixed z-50 flex items-center justify-center inset-0 ${darkMode ? "bg-stone-950/75" : "bg-gray-300/75"}`}>
      <div className={`${darkMode ? "bg-stone-950" : "bg-white/50"}  shadow-inner shadow-black p-8 rounded-lg`}>
        <h3 className="mb-4">
          Your login session has expired?
          <br />
          Please login again.
        </h3>
        <div className="flex">
          <button
            onClick={onCancel}
            className={`m-2 hover:-translate-y-2 duration-300 ${darkMode ? "shadow-inner shadow-amber-800" : "shadow-inner shadow-black"} hover:bg-amber-700 hover:text-white rounded-lg block px-8 py-2`}
            type="submit"
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            className={`m-2 hover:-translate-y-2 duration-300 ${darkMode ? "shadow-inner shadow-amber-800" : "shadow-inner shadow-black"} hover:bg-amber-700 hover:text-white rounded-lg block px-8 py-2`}
            type="submit"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
