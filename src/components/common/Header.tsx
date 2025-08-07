import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { LogOutIcon } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLogout } from '@/hooks/auth/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Header = () => {
    const { mutate: logoutUserFn } = useLogout('user');
    const profileImage = useSelector((state: RootState) => state.auth.user.profileImage);
    const userName = useSelector((state: RootState) => state.auth.user.firstName);

    const handleLogout = () => {
        logoutUserFn();
    };

    return (
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm relative">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold bg-gradient-to-r from-traveste-500 to-traveste-700 bg-clip-text">
                    Travesta
                </div>

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link to="/user/home" className={navigationMenuTriggerStyle()}>
                                Home
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link to="/user/hotels" className={navigationMenuTriggerStyle()}>
                                Hotels
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link to="/user/about-us" className={navigationMenuTriggerStyle()}>
                                About us
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* User Section */}
                <div className="flex items-center space-x-3">
                    <Link to="/user/profile">
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={profileImage} alt="User" />
                            <AvatarFallback>{userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                    </Link>

                    {/* Logout for desktop */}
                    <Button variant="outline" size="sm" className=" md:inline-flex" onClick={handleLogout}>
                        <LogOutIcon />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
