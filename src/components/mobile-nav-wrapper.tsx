"use client";

import { useState } from "react";
import { BottomNav } from "./bottom-nav";
import { MobileMenuSheet } from "./mobile-menu-sheet";

interface MobileNavWrapperProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function MobileNavWrapper({
  children,
  userEmail,
}: MobileNavWrapperProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {children}
      <BottomNav onMoreClick={() => setMenuOpen(true)} />
      <MobileMenuSheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        userEmail={userEmail}
      />
    </>
  );
}
