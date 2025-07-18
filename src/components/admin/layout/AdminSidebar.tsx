import { useLocation, useNavigate } from "react-router-dom"
import { Calendar, CalendarCheck, DollarSign, Layers, LayoutDashboard, MessageSquare, Tag, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, } from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export function AdminSidebar() {
    const admin = useSelector((state: RootState) => state.admin.admin);
    const location = useLocation()
    const navigate = useNavigate();
    const pathname = location.pathname

    const mainNavItems = [
        {
            title: "Overview",
            icon: LayoutDashboard,
            href: "/admin/dashboard",
            isActive: pathname === "/admin/dashboard",
        },
        {
            title: "Users & Vendors",
            icon: Users,
            href: "/admin/users",
            isActive: pathname === "/admin/users",
        },
        {
            title: "Vendor Requests",
            icon: Calendar,
            href: "/admin/vendor-requests",
            isActive: pathname === "/admin/vendor-requests",
        },
        {
            title: "Amenities",
            icon: Layers,
            href: "/admin/amenities",
            isActive: pathname === "/admin/amenities",
        },
        {
            title: "Messages",
            icon: MessageSquare,
            href: "/admin/chat",
            isActive: pathname === "/admin/chat",
        },
    ]

    const managementNavItems = [
        {
            title: "Payments & Wallet",
            icon: DollarSign,
            href: "/admin/payments",
            isActive: pathname === "/admin/payments",
        },
        {
            title: "Categories",
            icon: Tag,
            href: "/admin/categories",
            isActive: pathname === "/admin/categories",
        },
        {
            title: "Community & Contest",
            icon: CalendarCheck,
            href: "/admin/contest",
            isActive: pathname === "/admin/contest",
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                        <Layers className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="font-semibold">Admin Dashboard</div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton isActive={item.isActive} asChild>
                                        <button onClick={() => navigate(item.href)}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton isActive={item.isActive} asChild>
                                        <button onClick={() => navigate(item.href)}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                            <AvatarFallback>{admin?.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{admin?.firstName}</p>
                            <p className="text-xs text-muted-foreground">{admin?.email}</p>
                        </div>
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
