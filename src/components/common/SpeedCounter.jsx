import { useEffect, useState } from "react";

export function SpeedCounter({ value = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let val = 0;

    const interval = setInterval(() => {
      val = val + Math.ceil(value/1000);
      if (val <= value) {
        setCount(val);
      } else {
        stopCounter();
      }
    }, value > 1000 ? 1 : 50);

    const stopCounter = () => {
      clearInterval(interval);
    };

    return stopCounter;
  }, [value]);

  return (
    <div>{count}</div>
  );
}
