import { Link, useLocation } from "react-router-dom";
import { User, MessageCircle, Wallet, CalendarDays, X } from "lucide-react";

const links = [
    { path: "/user/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { path: "/user/booking", label: "Bookings", icon: <CalendarDays className="w-5 h-5" /> },
    { path: "/user/chat", label: "Chat", icon: <MessageCircle className="w-5 h-5" /> },
    { path: "/user/wallet", label: "Wallet", icon: <Wallet className="w-5 h-5" /> },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserSidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();

    return (
        <aside
            className={`fixed sm:relative z-10 w-64 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300  ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            <div className="flex items-center justify-between px-4 py-3 text-xl font-semibold border-b">
                <span>User Menu</span>
                <button className="md:hidden" onClick={onClose}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            <ul className="space-y-1 px-4">
                {links.map(({ path, label, icon }) => (
                    <li key={path}>
                        <Link
                            to={path}
                            className={`flex items-center gap-3 p-3 rounded-md text-sm hover:bg-yellow-100 transition ${location.pathname.includes(path) ? "bg-yellow-200 font-medium" : ""
                                }`}
                        >
                            {icon}
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default UserSidebar;
