import type * as React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface LinkShareButtonProps extends React.ComponentProps<"button"> {
  className?: string;
  label?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
  onShareSuccess?: (method: "native" | "clipboard", url?: string) => void;
  onShareError?: (error: unknown) => void;
  isSharedBoard?: boolean;
  shareUri?: string;
  onShareClick?: () => void;
}

function LinkShareButton({
  className,
  label = "링크 공유하기",
  Icon,
  children,
  isSharedBoard = false,
  shareUri,
  onShareClick,
  ...props
}: LinkShareButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isSharedBoard) {
      // preserve the shareUri when navigating into the letter flow
      if (shareUri) navigate(`/letter/guide/${shareUri}`);
      else navigate(ROUTES.LETTER.GUIDE.replace("/:shareUri", ""));
      return;
    }

    // 공유 모달 열기
    onShareClick?.();
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "h-[53px] w-full max-w-[450px]",
        "bg-[#8E2D2D]",
        "text-[#FFFFFF]",
        "font-bold text-[16px]",
        "hover:bg-[#7A2525]",
        "focus:outline-none focus:ring-2 focus:ring-[#8E2D2D]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children ?? (
        <>
          <span>{label}</span>
          {Icon && <Icon className="h-[20px] w-[20px]" />}
        </>
      )}
    </button>
  );
}

export { LinkShareButton };
