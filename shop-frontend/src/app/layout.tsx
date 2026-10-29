import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["900"], style: ["normal", "italic"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "K8s Shop",
  description: "A tiny shop for Kubernetes labs",
};

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[28px] font-black tracking-[-1px] ${className}`}>
      k8s<span className="text-honey">·</span>shop
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
        <header className="sticky top-0 z-10 border-b border-teal/10 bg-cream/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="leading-tight">
              <Logo className="text-teal" />
              <span className="block text-[11px] tracking-[0.88px] text-muted uppercase">Ship it to the cluster</span>
            </Link>
            <Link href="/" className="rounded-full bg-teal px-6 py-2.5 font-semibold text-white transition hover:brightness-110">
              Shop
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">{children}</main>
        <footer className="bg-ink pt-10 pb-16 text-white/50">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Logo className="text-white" />
              <p className="mt-1">Built for Kubernetes labs.</p>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} K8s Shop</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
