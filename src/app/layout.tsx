import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Link from "next/link";
import Nav from "../components/Nav";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nome do Site",
    template: "%s · Nome do Site",
  },
  description: "Controle suas contas, bancos e cartões em um só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-100 font-[family-name:var(--font-manrope)] text-slate-800">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-900 text-lg font-extrabold text-lime-300">
                N
              </span>
              <span className="text-lg font-extrabold tracking-tight text-teal-950">
                Nome do Site
              </span>
            </Link>
            <Nav />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-5 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}