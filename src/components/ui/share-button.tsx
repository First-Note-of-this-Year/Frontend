import type { ReactNode } from "react";

interface ShareButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  iconBgColor?: string;
}

export function ShareButton({
  onClick,
  icon,
  label,
  iconBgColor,
}: ShareButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-3 rounded-xl bg-[#F5F5F5] p-4 transition-all hover:bg-[#E8E8E8] focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center ${iconBgColor ? "rounded-full" : ""}`}
        style={iconBgColor ? { backgroundColor: iconBgColor } : undefined}
      >
        {icon}
      </div>
      <span className="font-medium text-[#3C1E1E] text-sm">{label}</span>
    </button>
  );
}
