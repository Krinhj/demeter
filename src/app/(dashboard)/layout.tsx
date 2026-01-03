import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatProvider, ChatOverlay, ChatTrigger } from "@/components/chat";

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
            <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-6">
              <SidebarTrigger className="-ml-2" />
              <div className="flex-1" />
              <ChatTrigger />
            </header>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <ChatOverlay />
      </ChatProvider>
    </TooltipProvider>
  );
}
