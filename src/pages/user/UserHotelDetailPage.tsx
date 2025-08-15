import React from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import HotelDetail from '@/components/hotel/HotelDetail';

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
