"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Library,
  Layers,
  HelpCircle,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首頁", icon: Home },
  { href: "/hangul", label: "韓文字母", icon: BookOpen },
  { href: "/vocabulary", label: "單字本", icon: Library },
  { href: "/flashcards", label: "閃卡", icon: Layers },
  { href: "/quiz", label: "測驗", icon: HelpCircle },
  { href: "/progress", label: "學習進度", icon: BarChart3 },
  { href: "/settings", label: "設定", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Nuri
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname === href
                    ? "bg-neutral-100 text-neutral-900 font-medium"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                )}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden border-t overflow-x-auto">
        <div className="flex px-2 py-1.5 gap-1 min-w-max">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors",
                pathname === href
                  ? "bg-neutral-100 text-neutral-900 font-medium"
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <Icon size={14} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
