import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Search, Bell, Activity, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full ambient-glow">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-12 sticky top-0 z-20 flex items-center justify-between px-4 gap-4 bg-card border-b border-border">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              {title && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-px h-5 bg-border" />
                  <div>
                    <h2 className="text-xs font-semibold text-foreground leading-none">{title}</h2>
                    {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search intelligence..."
                  className="pl-9 h-8 w-52 text-xs bg-secondary border-border focus:border-primary/40"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary intel-dot-active" />
              </Button>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-sm">
                        {userInitial}
                      </div>
                      <span className="text-[11px] text-foreground font-medium hidden lg:block max-w-[120px] truncate">
                        {displayName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 border-b border-border mb-1">
                      <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
                      <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuItem onClick={signOut} className="text-xs text-destructive cursor-pointer gap-2">
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto scrollbar-thin">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
