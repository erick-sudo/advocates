import { useContext } from "react";
import { utilityFunctions } from "../../assets/functions";
import { AuthContext } from "../context/AuthContext";

export function PairView({
  fields = [],
  title = "",
  hClassName = "px-4",
  wClassName = "",
  obj = {},
}) {
  const { darkMode } = useContext(AuthContext)
  return (
    <div className={wClassName}>
      {title && <h4 className={`${hClassName}`}>{title}</h4>}
      <div className="">
        {fields.map((field, index) => (
          <div key={index} className={`${darkMode ? "text-gray-500" : "text-black"}`}>
            <div
              className={`flex ${
                field.dir === "h" ? "flex-row" : "flex-col"
              } gap-2 p-1`}
            >
              <span
                className={`font-bold ${
                  field.dir === "h" ? "w-[30%] text-end px-2" : "w-full px-4"
                } px-2`}
              >
                {utilityFunctions.snakeCaseToTitleCase(field.name || "")}
              </span>
              <span
                className={`${field.dir === "h" ? "w-[70%] px-2" : "w-full px-3"}`}
              >
                {obj[field.name]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
