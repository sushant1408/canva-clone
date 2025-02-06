import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="size-8 relative shrink-0">
        <Image src="/logo.svg" alt="logo" fill className="shrink-0 hover:opacity-75 transition" />
      </div>
    </Link>
  );
};

export { Logo };
