import { useState } from "react";

export function TabSwitch({ options = [], darkMode }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="my-4">
      {options?.length > 0 && (
        <>
          <div className="flex gap-4 flex-wrap px-4">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`font-bold ${
                  idx === current ? "bg-yellow-800 text-white" : darkMode ? "shadow-black hover:shadow-gray-600/50" : "shadow-black hover:shadow-black/50"
                } rounded shadow-inner whitespace-nowrap px-4 py-2 first-letter:uppercase duration-200 hover:-translate-y-2 hover:shadow-lg`}
              >
                {option.name}
              </button>
            ))}
          </div>
          <div>{options[current].element}</div>
        </>
      )}
    </div>
  );
}
