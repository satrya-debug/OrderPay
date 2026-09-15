export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-brand-800 text-white"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm0 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M12 8a4 4 0 1 0 4 4"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
