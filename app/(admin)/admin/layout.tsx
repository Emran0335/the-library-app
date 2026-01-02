import AdminSidebar from "@/components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <div className="container">{children}</div>
      </SidebarProvider>
    </div>
  );
}
