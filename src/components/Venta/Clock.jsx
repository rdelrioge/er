import React, { useEffect, useState } from "react";

function Clock() {
  const [hoy, setHoy] = useState(new Date());

  useEffect(() => {
    let timerID = setInterval(() => setHoy(new Date()), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  return (
    <>
      {hoy.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  );
}

export default Clock;
