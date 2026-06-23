
"use client";

import { AuthProvider, useAuth } from "@/components/auth-provider";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { GraduationCap, LayoutDashboard, History, CreditCard, LogOut, UserCircle } from "lucide-react";
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
    { title: "Study Library", icon: History, path: "/dashboard/history" },
    { title: "Upgrade & Plan", icon: CreditCard, path: "/dashboard/billing" },
    { title: "My Account", icon: UserCircle, path: "/dashboard/account" },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-2 border-slate-100">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-black text-xl tracking-tighter group-data-[collapsible=icon]:hidden text-slate-900">StudyPilot</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title} className="rounded-xl h-11 font-bold">
                <Link href={item.path}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-slate-100">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary overflow-hidden shadow-sm">
              {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black truncate text-slate-900">{user?.displayName || 'Student'}</p>
              <p className="text-[10px] text-muted-foreground truncate font-bold uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-10 rounded-xl font-bold text-slate-500 hover:text-destructive hover:bg-destructive/5" onClick={handleLogout}>
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6 justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 text-slate-400 hover:text-primary transition-colors" />
              <div className="h-4 w-[1px] bg-slate-100 mx-3" />
              <h1 className="font-black text-sm uppercase tracking-widest text-slate-500">Study Workspace</h1>
            </div>
            <div className="flex items-center gap-4">
               <Badge className="bg-primary/5 text-primary border-none font-black text-[10px] tracking-widest hidden sm:flex">BETA V1.0</Badge>
            </div>
          </header>
          <main className="p-4 md:p-10 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}

