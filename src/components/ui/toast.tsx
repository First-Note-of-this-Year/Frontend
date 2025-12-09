import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  isOpen,
  message,
  onClose,
  duration = 1500,
}: ToastProps) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="-translate-x-1/2 fixed left-1/2 transform"
      style={{
        bottom: "100px",
        zIndex: 9999,
        maxWidth: "90%",
        width: "auto",
      }}
    >
      <div
        className="rounded-lg px-6 py-4 text-center text-white shadow-lg"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          fontSize: "16px",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </div>
    </div>,
    document.body
  );
}
