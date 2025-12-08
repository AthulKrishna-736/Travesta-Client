import React, { useState } from 'react'
import Header from '../header/vendor/Header'
import Sidebar from '../sidebar/Sidebar';
import { ILayoutProps } from '@/types/custom.types';

const VendorLayout: React.FC<ILayoutProps> = ({ children, title }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
            <Sidebar isOpen={sidebarOpen} />
            <main className={`flex-grow bg-[#ebebeb] px-4 py-6 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-14 ml-0'}`}>
                <div className='mx-auto max-w-7xl mt-15 bg-white p-6 rounded-md'>
                    {title && (<h1 className="mb-6 text-3xl font-bold">{title}</h1>)}
                    {children}
                </div>
            </main>
        </div>
    );
}

export default VendorLayout;