import { useLocation, useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, Layers, LayoutDashboard, MessageSquare, PlayIcon, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, } from "@/components/ui/sidebar"
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
        {
            title: "Subscription",
            icon: PlayIcon,
            href: "/admin/subscription",
            isActive: pathname === "/admin/subscription",
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
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.isActive}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors border-l-4 ${item.isActive
                                            ? "!bg-blue-100 text-blue-600 font-medium border-blue-600"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-500 border-transparent"
                                            }`}
                                    >
                                        <button onClick={() => navigate(item.href)}>
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            <span>{item.title}</span>
                                            <ChevronRight className="h-4 w-4 shrink-0 ml-auto" />
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between px-4 py-2 bg-slate-500 border border-black rounded-md">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                            <AvatarFallback>{admin?.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{admin?.firstName}</p>
                            <p className="text-xs">{admin?.email}</p>
                        </div>
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
