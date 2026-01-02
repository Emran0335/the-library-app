import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserButton from "@/components/user-button";
import { Library, MapIcon, PartyPopper, Receipt, User2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const menu_items = [
  {
    title: "Catalog",
    url: "/admin",
    icon: Library,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: MapIcon,
  },
  {
    title: "Activities",
    url: "/admin/activities",
    icon: PartyPopper,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User2,
  },
  {
    title: "Fines",
    url: "/admin/fines",
    icon: Receipt,
  },
];

export default function AdminSidebar() {
 return (
    <Sidebar className="p-0" variant="floating">
      <SidebarHeader className="p-0 mb-4">
        <p className="text-lg bg-black text-white p-2 text-center">Admin</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menu_items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 text-center">
            <UserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
