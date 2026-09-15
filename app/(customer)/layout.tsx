import { BottomNav } from "@/components/layout/BottomNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#f4f4f2] pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
