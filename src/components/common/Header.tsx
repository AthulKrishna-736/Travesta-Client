import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Hotel, Search, Menu, Bell, LogOutIcon } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLogout } from '@/hooks/auth/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Header = () => {
    const { mutate: logoutUserFn } = useLogout('user')
    const profileImage = useSelector((state: RootState) => state.auth.user.profileImage)

    const handleLogout = () => {
        logoutUserFn()
    };

    return (
        <header className="sticky top-0 w-full bg-white/70 backdrop-blur-md z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-traveste-500 to-traveste-700 bg-clip-text">
                            Travesta
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link to="/user/home" className={navigationMenuTriggerStyle()}>
                                Home
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Hotels</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    <ListItem title="Featured Hotels" href="/user/hotels" Icon={Hotel}>
                                        Exclusive deals on our top-rated hotel partners
                                    </ListItem>
                                    <ListItem title="Last Minute Deals" href="/user/hotels" Icon={Search}>
                                        Great savings on last-minute bookings
                                    </ListItem>
                                    <ListItem title="Luxury Stays" href="/user/hotels" Icon={Hotel}>
                                        Premium accommodations for a memorable experience
                                    </ListItem>
                                    <ListItem title="Budget Options" href="/user/hotels" Icon={Hotel}>
                                        Comfortable stays that won't break the bank
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/user/subscription" className={navigationMenuTriggerStyle()}>
                                Subscription
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to='/user/about-us' className={navigationMenuTriggerStyle()}>
                                About us
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/user/chat" className={navigationMenuTriggerStyle()}>
                                Chat
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>

                </NavigationMenu>

                {/* User Section */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <span className="sr-only">Notifications</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                            2
                        </div>
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Link to="/user/profile">
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={profileImage} alt="User" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Button size="icon" variant="outline" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Logout Button */}
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOutIcon />
                    </Button>
                </div>
            </div>
        </header>
    );
};

interface ListItemProps {
    title: string;
    href: string;
    children: React.ReactNode;
    Icon?: React.ComponentType<{ className?: string }>;
}

const ListItem = ({ title, href, children, Icon }: ListItemProps) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    href={href}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}>
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5 text-traveste-500" />}
                        <div className="text-sm font-medium leading-none">{title}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
};

export default Header;
