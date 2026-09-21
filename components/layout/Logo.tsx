import Image from "next/image";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-xl"
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/menu/logo_orderpay1.png"
        alt="Logo OrderPay"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
}