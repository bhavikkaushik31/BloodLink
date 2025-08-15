import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AlertTriangle,
  Heart,
  MapPin,
  Users,
  Activity,
  Settings,
  BarChart3,
  Droplets,
  Bell,
  TestTubes
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { title: "Dashboard", url: "/", icon: Activity },
    ];

    if (user?.role === 'hospital_staff' || user?.role === 'hospital_admin') {
      return [
        ...commonItems,
        { title: "Active Alerts", url: "/alerts", icon: AlertTriangle },
        { title: "Donor Matches", url: "/matches", icon: Users },
        { title: "Map View", url: "/map", icon: MapPin },
        { title: "Inventory", url: "/inventory", icon: Droplets },
        { title: "BloodBanks", url: "/BloodBanks", icon: TestTubes },


      ];
    }

    if (user?.role === 'donor') {
      return [
        ...commonItems,
        { title: "My Profile", url: "/profile", icon: Users },
        { title: "Alerts Near Me", url: "/nearby-alerts", icon: Bell },
        
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { title: "System Overview", url: "/system", icon: Activity },
        { title: "All Alerts", url: "/all-alerts", icon: AlertTriangle },
        { title: "Hospitals", url: "/hospitals", icon: Heart },
        { title: "Donors", url: "/donors", icon: Users },
        { title: "Analytics", url: "/system-analytics", icon: BarChart3 },
        { title: "Settings", url: "/settings", icon: Settings },
      ];
    }

    return commonItems;
  };

  const items = getNavigationItems();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user?.role === 'donor' ? 'Donor Portal' : 
             user?.role === 'admin' ? 'System Admin' : 
             'Hospital Dashboard'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}