"use client";

import Link from "next/link";
import { User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { logoutAction } from "@/server/actions/auth.actions";

interface MobileMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

export function MobileMenuSheet({
  open,
  onOpenChange,
  userEmail,
}: MobileMenuSheetProps) {
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await logoutAction();
  };

  const menuItems = [
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-0 pb-6">
        <SheetHeader className="px-6 pb-3">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="space-y-0 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Separator className="my-1.5" />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <span>Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          <Separator className="my-1.5" />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>

        {userEmail && (
          <div className="mt-4 px-6 text-xs text-muted-foreground">
            {userEmail}
          </div>
        )}

        {/* Safe area for iPhone home indicator */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </SheetContent>
    </Sheet>
  );
}
