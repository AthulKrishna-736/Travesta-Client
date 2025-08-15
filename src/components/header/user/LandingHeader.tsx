import { useState } from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

const LandingHeader = () => {
    const [open, setOpen] = useState(false);

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

                {/* Navigation - Desktop */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        {["Home", "About Us"].map((label, index) => (
                            <NavigationMenuItem key={index}>
                                <Link
                                    to={`/user/${label.toLowerCase().replace(/\s/g, '-')}`}
                                    className={navigationMenuTriggerStyle()}
                                >
                                    {label}
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Action Buttons - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <Link to="/user/login">
                        <Button variant="outline" className="bg-white text-black border border-black hover:bg-gray-100 text-sm">
                            Become a User ?
                        </Button>
                    </Link>
                    <Link to="/vendor/login">
                        <Button className="bg-yellow-400 text-black hover:bg-yellow-300 text-sm">
                            Become a Vendor ?
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
                        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {open && (
                <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-4 md:hidden">
                    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                    <Link to="/user/about-us" onClick={() => setOpen(false)}>About Us</Link>

                    <div className="mt-6 flex flex-col gap-2">
                        <Link to="/user/login" onClick={() => setOpen(false)}>
                            <Button variant="outline" className="bg-white text-black border border-black w-full text-sm">
                                Become a User ?
                            </Button>
                        </Link>
                        <Link to="/vendor/login" onClick={() => setOpen(false)}>
                            <Button className="bg-yellow-400 text-black hover:bg-yellow-300 w-full text-sm">
                                Become a Vendor ?
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default LandingHeader;
