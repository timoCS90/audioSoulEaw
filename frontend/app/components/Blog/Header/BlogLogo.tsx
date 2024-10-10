import Image from "next/image";

import Link from "next/link";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <a>
          <Image src="@/Logo.png" alt="Logo" width={200} height={50} />
        </a>
      </Link>
    </div>
  );
};

export default Logo;
