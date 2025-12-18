import { useState } from 'react';
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

const LandingHeader = () => {
    const [sideBar, setSideBar] = useState<boolean>(false);

    return (
        <header className="w-full bg-white shadow-sm">
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

                {/* Users */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to='/user/login' className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Login or Create Account
                    </Link>

                    <Link to="/vendor/login" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Become a Partner
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setSideBar(true)} className='cursor-pointer'>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {sideBar && (
                <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 py-5 px-4 flex flex-col gap-6 md:hidden">
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[23px] font-medium tracking-tight'>
                            Travesta
                        </h1>
                        <button onClick={() => setSideBar(false)} className='cursor-pointer'><X className="w-6 h-6" /></button>
                    </div>

                    <Link to="/" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Home
                    </Link>

                    <Link to="/user/about-us" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        About Us
                    </Link>

                    <Link to="/user/login" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Login or Create Account
                    </Link>

                    <Link to="/vendor/login" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                        Become a Partner
                    </Link>
                </div>
            )}
        </header >
    );
};

export default LandingHeader;
