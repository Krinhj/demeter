import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatProvider, ChatOverlay, ChatTrigger } from "@/components/chat";
import { MobileNavWrapper } from "@/components/mobile-nav-wrapper";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth redirect is handled by middleware
  return (
    <TooltipProvider>
      <ChatProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <MobileNavWrapper>
              <div className="flex min-h-screen flex-col bg-background text-foreground pb-16 md:pb-0">
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 md:px-6">
                  <SidebarTrigger className="-ml-2 hidden md:flex" />
                  <div className="flex-1" />
                  <ChatTrigger className="hidden md:inline-flex" />
                </header>
                <main className="flex-1 overflow-auto px-4 md:px-0">
                  {children}
                </main>
              </div>
            </MobileNavWrapper>
          </SidebarInset>
        </SidebarProvider>
        <ChatOverlay />
      </ChatProvider>
    </TooltipProvider>
  );
}
