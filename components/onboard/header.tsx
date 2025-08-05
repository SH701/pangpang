import Image from "next/image";

export default function Header() {
  return (
    <div className="absolute top-15 left-8">
      <Image src="/logo.png" alt="logo" width={100} height={40} />
    </div>
  );
}
