"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Resumo" },
  { href: "/bancos", label: "Bancos" },
  { href: "/cartoes", label: "Cartões" },
  { href: "/contas", label: "Contas" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full justify-between gap-1 text-sm font-semibold sm:w-auto sm:justify-start">
      {links.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-2 sm:px-4 ${
              active
                ? "bg-teal-900 text-white"
                : "text-slate-600 hover:bg-teal-50 hover:text-teal-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}