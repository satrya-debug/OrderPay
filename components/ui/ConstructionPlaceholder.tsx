import { Hammer } from "lucide-react";

export function ConstructionPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
        <Hammer size={20} />
      </span>
      <h2 className="mt-3 text-lg font-semibold text-neutral-800">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-neutral-500">
        Halaman ini belum ada desainnya. Kirim mockup-nya dan saya buatkan kodenya.
      </p>
    </div>
  );
}
