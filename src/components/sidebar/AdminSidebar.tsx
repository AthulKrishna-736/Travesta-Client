import { useLocation, useNavigate } from "react-router-dom"
import {
    Calendar,
    ChevronRight,
    Layers,
    LayoutDashboard,
    MessageSquare,
    PlayIcon,
    Users,
    Wallet2,
    ShieldCheck,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export function AdminSidebar() {
    const admin = useSelector((state: RootState) => state.user.user)
    const location = useLocation()
    const navigate = useNavigate()
    const pathname = location.pathname

    const mainNavItems = [
        {
            title: "Overview",
            icon: LayoutDashboard,
            href: "/admin/dashboard",
        },
        {
            title: "Users & Vendors",
            icon: Users,
            href: "/admin/users",
        },
        {
            title: "Vendor Requests",
            icon: Calendar,
            href: "/admin/vendor-requests",
        },
        {
            title: "Amenities",
            icon: Layers,
            href: "/admin/amenities",
        },
        {
            title: "Messages",
            icon: MessageSquare,
            href: "/admin/chat",
        },
        {
            title: "Subscription",
            icon: PlayIcon,
            href: "/admin/subscription",
        },
        {
            title: "Wallet",
            icon: Wallet2,
            href: "/admin/wallet",
        },
    ]

    return (
        <Sidebar className="border-r border-slate-200 bg-white">
            {/* Minimal Brand */}
            <SidebarHeader className="px-4 pt-6 pb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-md shadow-indigo-200">
                        <Layers className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
                            Travesta
                        </h2>
                        <div className="mt-0.5 flex items-center gap-1.5">
                            <ShieldCheck className="h-3 w-3 text-indigo-500" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                Administration
                            </span>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="px-3 pt-3">
                <SidebarGroup>
                    <div className="mb-3 px-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Workspace
                        </span>
                    </div>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {mainNavItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`)

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`
                                                group relative h-11 rounded-xl px-3
                                                transition-all duration-200 cursor-pointer
                                                ${isActive
                                                    ? "!bg-indigo-50 !text-indigo-700 font-semibold shadow-sm"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                }
                                            `}
                                        >
                                            <button
                                                onClick={() => navigate(item.href)}
                                                className="flex w-full items-center gap-3"
                                            >
                                                <item.icon
                                                    className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive
                                                        ? "text-indigo-600"
                                                        : "text-slate-400 group-hover:text-slate-700"
                                                        }`}
                                                />

                                                <span className="flex-1 text-[13px]">
                                                    {item.title}
                                                </span>

                                                {isActive && (
                                                    <ChevronRight className="h-4 w-4 text-indigo-500" />
                                                )}
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Admin Profile */}
<SidebarFooter className="mt-auto w-full border-t border-slate-100 p-3">

    {/* Profile Card */}
    <div className="group relative w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 transition-all duration-200 hover:border-indigo-200 hover:shadow-sm">

        <div className="flex w-full items-center gap-3">

            <div className="relative shrink-0">
                <Avatar className="h-10 w-10 rounded-xl border border-indigo-100">
                    <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                    <AvatarFallback className="rounded-xl bg-indigo-600 text-sm font-bold text-white">
                        {admin?.firstName?.charAt(0)?.toUpperCase() ?? "A"}
                    </AvatarFallback>
                </Avatar>

                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                    {admin?.firstName ?? "Administrator"}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                    {admin?.email ?? "Admin account"}
                </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
        </div>
    </div>

    {/* Footer Info */}
    <div className="flex w-full items-center justify-between px-1 pt-3">
        <span className="text-[10px] font-medium text-slate-400">
            © {new Date().getFullYear()} Travesta
        </span>

        <span className="text-[10px] font-medium text-slate-400">
            Admin Portal
        </span>
    </div>

</SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
