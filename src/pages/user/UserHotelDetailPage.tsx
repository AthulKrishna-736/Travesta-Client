import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HotelDetail from '@/components/user/HotelDetailPage';

const UserHotelDetailPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <HotelDetail />
            </main>
            <Footer />
        </div>
    );
};

export default UserHotelDetailPage;
