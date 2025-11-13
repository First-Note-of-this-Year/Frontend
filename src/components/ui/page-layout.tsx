import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/back-button";

interface PageLayoutProps {
  title: ReactNode;
  children?: ReactNode;
  bottomContent?: ReactNode;
  className?: string;
  showBackButton?: boolean;
}

export function PageLayout({
  title,
  children,
  bottomContent,
  className = "",
  showBackButton = true,
}: PageLayoutProps) {
  return (
    <div
      className={`dynamic-padding-top relative flex h-full w-full flex-col min-[451px]:md:pt-48 min-[451px]:sm:pt-44 ${className}`}
    >
      {showBackButton && <BackButton />}
      <p className="font-primary text-[32px] text-red-200 leading-12">
        {title}
      </p>

      {children && <div className="flex-1">{children}</div>}

      {bottomContent && (
        <div className="z-10 mt-auto pb-4">{bottomContent}</div>
      )}
    </div>
  );
}
