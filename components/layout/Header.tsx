import { Logo } from "./Logo";
import { RESTAURANT_NAME } from "@/lib/constants";

interface HeaderProps {
  title: string;
  badgeLabel: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export function Header({ title, badgeLabel }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-black/5">
      <div className="flex items-center gap-2.5">
        <Logo size={32} />
        <div className="leading-tight">
          <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
          <h1 className="text-[15px] font-semibold text-neutral-900">{title}</h1>
        </div>
      </div>
      <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        {badgeLabel}
      </span>
    </header>
  );
}
