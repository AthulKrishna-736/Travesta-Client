import React, { ReactElement, useState } from 'react'
import Header from '../header/user/Header'
import UserSidebar from '../sidebar/UserSidebar'
import { Menu } from 'lucide-react';
import Footer from '../footer/Footer';

interface IUserLayoutProps {
    children: ReactElement;
}

const UserLayout: React.FC<IUserLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSideBarOpen] = useState<boolean>(true);
    return (
        <div className='min-h-screen flex flex-col bg-[#f2f2f2]'>
            <Header />

            {/* Wrapper row Sidebar + Main */}
            <div className='flex flex-1'>
                <UserSidebar isOpen={sidebarOpen} onClose={() => setSideBarOpen(false)} />

                {/* Content component */}
                <main className='lg:max-w-6xl w-full h-full p-4 mx-auto'>
                    {children}
                </main>
            </div>

            {/* SideBar Menu button */}
            {!sidebarOpen && (
                <button
                    className="fixed top-18 left-1 z-40 bg-blue-400 p-2 rounded-md shadow-lg"
                    onClick={() => setSideBarOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            <Footer />
        </div>
    )
}

export default UserLayout;