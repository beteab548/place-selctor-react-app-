import { useEffect, useRef, useState } from "react";

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const timer = 3000;
  const [remainingTime, setRemainingTime] = useState(timer);
  useEffect(() => {
    setInterval(() => {
      const remainingInterval = setRemainingTime((prevValue) => {
        console.log(prevValue);
        return prevValue - 10;
      });
    }, 10);
  }, []);
  useEffect(() => {
    console.log("timer is set");
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);
    return () => {
      console.log("cleaning the timer");
      clearTimeout(timer);
    };
  }, [onConfirm]);
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remainingTime} max={timer}></progress>
    </div>
  );
}
