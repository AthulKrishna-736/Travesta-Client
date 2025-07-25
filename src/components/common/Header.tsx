import React, { useState } from 'react';
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
import { Hotel, Search, Menu, LogOutIcon, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLogout } from '@/hooks/auth/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Header = () => {
    const { mutate: logoutUserFn } = useLogout('user');
    const profileImage = useSelector((state: RootState) => state.auth.user.profileImage);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logoutUserFn();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm relative">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-traveste-500 to-traveste-700 bg-clip-text">
                        Travesta
                    </Link>

                    {/* Desktop Navigation */}
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
                                <Link to="/user/about-us" className={navigationMenuTriggerStyle()}>
                                    About us
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to="/user/chat" className={navigationMenuTriggerStyle()}>
                                    Chat
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to="/user/booking" className={navigationMenuTriggerStyle()}>
                                    Bookings
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to="/user/wallet" className={navigationMenuTriggerStyle()}>
                                    Wallet
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>

                    </NavigationMenu>

                    {/* User Section */}
                    <div className="flex items-center space-x-3">

                        <Link to="/user/profile">
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={profileImage} alt="User" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>

                        {/* Mobile Toggle */}
                        <Button size="icon" variant="outline" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        {/* User Section */}
                        <div className="flex items-center space-x-4">
                            {/* Logout (Desktop only) */}
                            <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={handleLogout}>
                                <LogOutIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-[68px] left-0 w-full bg-white border-t z-50 shadow-md px-4 py-4">
                    <nav className="flex flex-col space-y-2">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-center bg-gradient-to-r from-traveste-500 to-traveste-700 bg-clip-text">
                            Travesta
                        </Link>

                        {[
                            { to: "/user/home", label: "Home" },
                            { to: "/user/hotels", label: "Hotels" },
                            { to: "/user/subscription", label: "Subscription" },
                            { to: "/user/about-us", label: "About us" },
                            { to: "/user/chat", label: "chat" },
                            { to: "/user/booking", label: "Bookings" },
                            { to: "/user/wallet", label: "Wallet" },
                        ].map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="py-2 px-3 rounded hover:bg-traveste-50 hover:text-traveste-700 transition-colors text-gray-700"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="py-2 px-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            )}
        </>
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
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5 text-traveste-500" />}
                        <div className="text-sm font-medium">{title}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
};

export default Header;
