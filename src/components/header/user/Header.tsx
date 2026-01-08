import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/auth/useLogout";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { saveLastVisitedPath } from "@/store/slices/navigationSlice";
import { useGetUser } from "@/hooks/user/useUser";
import { useMemo, useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import NotificationModal from "@/components/common/NotificationModal";
import { useGetLiveNotifications, useGetNotification } from "@/hooks/user/useNotification";
import { INotification } from "@/types/notification.types";
import { Badge } from "@/components/ui/badge";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [sideBar, setSideBar] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [liveNotifications, setLiveNotifications] = useState<INotification[]>([]);

    const isAuthenticated = Boolean(useSelector((state: RootState) => state.user.user?.id));

    const { data: oldNotifications = [], isLoading } = useGetNotification(isAuthenticated);
    useGetUser(isAuthenticated);
    useGetLiveNotifications(isAuthenticated, setLiveNotifications);

    const unreadCount = useMemo(() => {
        const map = new Map<string, INotification>();

        [...oldNotifications, ...liveNotifications].forEach(n => {
            map.set(n.id, n);
        });

        return Array.from(map.values()).filter(n => !n.isRead).length;
    }, [oldNotifications, liveNotifications]);

    const { mutate: logoutUserFn } = useLogout("user");

    const user = useSelector((state: RootState) => state.user.user?.id);
    const profileImage = useSelector((state: RootState) => state.user.user?.profileImage);
    const userName = useSelector((state: RootState) => state.user.user?.firstName);

    const handleLogout = () => {
        logoutUserFn();
    };

    return (
        <header className='w-full bg-white shadow-sm relative'>
            <div className="py-3 px-7 flex items-center justify-between">
                {/* Title and Nav*/}
                <div className="flex w-1/3 justify-between">
                    <h1 className='text-[23px] font-medium tracking-tight'>
                        Travesta
                    </h1>

                    <div className="hidden md:flex items-center gap-10">
                        <Link to='/user/home' className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                            Home
                        </Link>

                        <Link to='/user/subscription' className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                            Subscriptions
                        </Link>

                        <Link to="/user/about-us" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                            About Us
                        </Link>
                    </div>
                </div>

                {/* User Section */}
                {user ? (
                    <div className="hidden md:flex items-center justify-center gap-4">
                        <button className="cursor-pointer relative" onClick={() => { setIsNotificationOpen(true) }}>
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <Badge
                                    className="absolute -top-2 -left-4 h-4 w-4 p-2 bg-red-500 text-[12px] font-semibold flex items-center justify-center rounded-full"                                >
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </Badge>
                            )}
                        </button>
                        <Link to="/user/profile">
                            <div className="flex justify-center items-center gap-3">
                                <Avatar className="rounded-full w-8 h-8">
                                    <AvatarImage src={profileImage} alt="User" />
                                    <AvatarFallback>
                                        {userName?.charAt(0).toUpperCase() || "N"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold">
                                    Welcome, {userName}
                                </span>

                            </div>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="text-xs text-red-500 font-semibold hover:underline hover:underline-offset-4"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            dispatch(
                                saveLastVisitedPath(
                                    window.location.pathname +
                                    window.location.search
                                )
                            );
                            navigate("/user/login");
                        }}
                        className="text-xs font-semibold hover:underline hover:underline-offset-4"
                    >
                        Login or Create Account
                    </button>
                )}

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center justify-center gap-4">
                    {user && (
                        <button onClick={() => { setIsNotificationOpen(true) }} className="cursor-pointer relative">
                            <Bell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <Badge
                                    className="absolute -top-2 -left-4 h-4 w-4 p-2 bg-red-500 text-[12px] font-semibold flex items-center justify-center rounded-full"                                >
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </Badge>
                            )}
                        </button>
                    )}

                    <button onClick={() => setSideBar(true)} className='cursor-pointer'>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div >

            {isNotificationOpen && (
                <NotificationModal
                    open={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={oldNotifications}
                    liveNotifications={liveNotifications}
                    setLiveNotifications={setLiveNotifications}
                    loading={isLoading}
                />
            )}

            {sideBar && (
                <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 py-5 px-4 flex flex-col gap-6 md:hidden">
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[23px] font-medium tracking-tight'>
                            Travesta
                        </h1>
                        <button onClick={() => setSideBar(false)} className='cursor-pointer'><X className="w-6 h-6" /></button>
                    </div>

                    <Link to="/user/profile" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Profile
                    </Link>

                    <Link to="/user/home" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Home
                    </Link>

                    <Link to="/user/subscription" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Subscription
                    </Link>

                    <Link to="/user/wallet" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Wallet
                    </Link>

                    <Link to="/user/booking" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Bookings
                    </Link>

                    <Link to="/user/about-us" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        About Us
                    </Link>

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="text-xs text-left text-red-500 font-semibold hover:underline hover:underline-offset-4"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </header >
    );
};

export default Header;
