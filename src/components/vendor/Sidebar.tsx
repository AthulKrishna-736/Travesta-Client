import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Building, Calendar, BarChart3, Star, MessageSquare, Settings, LogOut, TagIcon, Wallet } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLogout } from '@/hooks/auth/useLogout';

interface SidebarProps {
    isOpen: boolean;
}

const navItems = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Hotels', path: '/vendor/hotels', icon: Building },
    { name: 'Bookings', path: '/vendor/bookings', icon: Calendar },
    // { name: 'Analytics', path: '/vendor/analytics', icon: BarChart3 },
    // { name: 'Reviews', path: '/vendor/reviews', icon: Star, badge: '3' },
    // { name: 'Promotions', path: '/vendor/promotions', icon: TagIcon },
    { name: 'Messages', path: '/vendor/messages', icon: MessageSquare },
    { name: 'Wallet', path: '/vendor/wallet', icon: Wallet },
    // { name: 'Settings', path: '/vendor/settings', icon: Settings },
];

const Sidebar = ({ isOpen }: SidebarProps) => {

    const { mutate: logoutVendor } = useLogout('vendor')

    const handleLogout = () => {
        logoutVendor()
    }

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20 overflow-y-auto scrollbar-hide",
                isOpen ? "w-64" : "w-0 -translate-x-full sm:translate-x-0 sm:w-16"
            )}
        >
            <div className={cn("flex flex-col h-full", !isOpen && "sm:items-center")}>
                <Separator />
                <nav className="flex-1 p-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => cn(
                                        "flex items-center px-3 py-2 rounded-md text-sm group transition-colors",
                                        isActive ? "bg-travesta-50 text-travesta-700" : "text-gray-700 hover:bg-gray-100",
                                        !isOpen && "sm:justify-center sm:px-2"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5",
                                        !isOpen ? "mr-0" : "mr-3"
                                    )} />
                                    {isOpen && (<span>{item.name}</span>)}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-2 mt-auto">
                    <button
                        onClick={handleLogout}
                        type="button"
                        className={cn(
                            "flex items-center w-full px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors",
                            !isOpen && "sm:justify-center sm:px-2"
                        )}
                    >
                        <LogOut className={cn("h-5 w-5", !isOpen ? "mr-0" : "mr-3")} />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
