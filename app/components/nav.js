"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navigation({ navLinks }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col columns-10 bg-slate-400">
      {navLinks.map((link) => {
        const isActive = pathname.includes(link.href);

        return (
          <Link
            className={isActive ? "text-blue-600" : "text-white"}
            href={link.href}
            key={link.name}
          >
            {link.icon}
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
