import {} from "react";
import { Background } from "./DottedBackground";

export function NoResults({ className, content }) {
  return (
    <div
      className={`min-h-[40vh] m-2 relative flex items-center justify-center ${className}`}
    >
      <Background />
      <div className="z-20">{content}</div>
    </div>
  );
}
