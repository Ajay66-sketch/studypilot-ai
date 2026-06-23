"use client";

import { AuthProvider, useAuth } from "@/components/auth-provider";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { GraduationCap, LayoutDashboard, History, CreditCard, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const menuItems = [
    { title: "Workspace", icon: LayoutDashboard, path: "/dashboard" },
    { title: "History", icon: History, path: "/dashboard/history" },
    { title: "Plan & Billing", icon: CreditCard, path: "/dashboard/billing" },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">StudyPilot</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title}>
                <Link href={item.path}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
              {user?.photoURL ? <img src={user.photoURL} alt="Avatar" /> : user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.displayName || 'Student'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="bg-background">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="h-4 w-[1px] bg-border mx-2" />
              <h1 className="font-medium">Study Workspace</h1>
            </div>
          </header>
          <main className="p-4 md:p-8 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}