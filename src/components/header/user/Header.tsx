import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { LogOutIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/auth/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Header = () => {
    const navigate = useNavigate();
    const { mutate: logoutUserFn } = useLogout('user');
    const location = useLocation();
    const user = useSelector((state: RootState) => state.user.user?.id);
    const profileImage = useSelector((state: RootState) => state.user.user?.profileImage);
    const userName = useSelector((state: RootState) => state.user.user?.firstName);

    const isHotelPath = location.pathname.startsWith("/user/hotels");

    const handleLogout = () => {
        logoutUserFn();
    };

    return (
        <header className={`${isHotelPath ? "relative z-50" : "sticky top-0 z-50"} bg-white/70 backdrop-blur-md shadow-md`}>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
                    Travesta
                </div>

                {/* Desktop Navigation */}
                {user && (
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link to="/user/home" className={navigationMenuTriggerStyle()}>
                                    Home
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link to="/user/about-us" className={navigationMenuTriggerStyle()}>
                                    About us
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to="/user/subscription" className={navigationMenuTriggerStyle()}>
                                    Subscription
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                )}


                {/* User Section */}
                {user ? (
                    <div className="flex items-center space-x-3">
                        <Link to="/user/profile">
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={profileImage} alt="User" />
                                <AvatarFallback>{userName?.charAt(0).toUpperCase() || 'N/A'}</AvatarFallback>
                            </Avatar>
                        </Link>

                        {/* Logout for desktop */}
                        <Button variant="outline" size="sm" className=" md:inline-flex" onClick={handleLogout}>
                            <LogOutIcon />
                        </Button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/user/login')}
                        className="text-left text-xs font-semibold px-2 py-1 rounded-md hover:text-white hover:bg-blue-500 cursor-pointer"
                    >
                        Login or <br />Create Account
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
