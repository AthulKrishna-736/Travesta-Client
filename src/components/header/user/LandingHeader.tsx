import { useState } from 'react';
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
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
                            Travesta
                        </span>
                    </Link>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <Link to='/user/login'>
                        <button
                            className="text-left text-xs font-semibold px-2 py-1 rounded-md hover:text-white hover:bg-blue-500 cursor-pointer"
                        >
                            Login or <br />Create Account
                        </button>
                    </Link>

                    <Link to="/vendor/login">
                        <button
                            className="text-left text-xs font-semibold px-2 py-1 rounded-md text-black bg-yellow-400 hover:text-white hover:bg-yellow-500 cursor-pointer"
                        >
                            Become a <br />Vendor
                        </button>
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
                                Login or <br />Create Account
                            </Button>
                        </Link>
                        <Link to="/vendor/login" onClick={() => setOpen(false)}>
                            <Button className="bg-yellow-400 text-black hover:bg-yellow-300 w-full text-sm">
                                Become a Vendor
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default LandingHeader;
