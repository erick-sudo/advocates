import {} from "react";
import { utilityFunctions } from "../../assets/functions";

export function PairView({
  fields = [],
  title = "",
  hClassName = "px-4",
  wClassName = "",
  obj = {},
}) {
  return (
    <div className={wClassName}>
      {title && <h4 className={`${hClassName}`}>{title}</h4>}
      <div className="">
        {fields.map((field, index) => (
          <div key={index} className="text-gray-700">
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
