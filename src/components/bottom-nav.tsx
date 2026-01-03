"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Leaf, CalendarDays, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatOverlay } from "./chat/chat-provider";

interface BottomNavProps {
  onMoreClick: () => void;
}

export function BottomNav({ onMoreClick }: BottomNavProps) {
  const pathname = usePathname();
  const { openChat } = useChatOverlay();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Recipes",
      href: "/recipes",
      icon: ShoppingCart,
      isActive: pathname.startsWith("/recipes"),
    },
    {
      label: "Demeter",
      onClick: openChat,
      icon: Leaf,
      isHighlighted: true,
    },
    {
      label: "Planner",
      href: "/meal-plans",
      icon: CalendarDays,
      isActive: pathname.startsWith("/meal-plans"),
    },
    {
      label: "More",
      onClick: onMoreClick,
      icon: Menu,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon
                className={cn(
                  "h-5 w-5",
                  item.isHighlighted && "text-primary"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  item.isActive && "font-semibold text-foreground",
                  item.isHighlighted && "font-semibold text-primary",
                  !item.isActive &&
                    !item.isHighlighted &&
                    "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                  item.isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                item.isHighlighted
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {content}
            </button>
          );
        })}
      </div>
      {/* Safe area for iPhone home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
