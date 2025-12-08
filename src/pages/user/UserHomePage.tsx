import React from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import HeroBanner from '@/components/user/home/HeroBanner';
import Features from '@/components/user/home/Features';
import TravelLocation from '@/components/user/home/TravelLocations';
import TrendingHotels from '@/components/hotel/TrendingHotels';
import { useGetTrendingHotels } from '@/hooks/vendor/useHotel';


const UserHomePage: React.FC = () => {
    const { data: TrendingRes } = useGetTrendingHotels();
    const hotels = TrendingRes?.data || []
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-[#f1f1f1]">
                {hotels.length > 0 && <TrendingHotels hotel={hotels[0]} />}
                <HeroBanner />
                <Features />
                <TravelLocation />
            </main>
            <Footer />
        </div>
    );
};

export default UserHomePage;