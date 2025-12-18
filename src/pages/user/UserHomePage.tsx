import React from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import TravelLocation from '@/components/home/TravelLocations';
import { useGetTrendingHotels } from '@/hooks/vendor/useHotel';
import LuxuryProperties from '@/components/home/TrendingProperties';


const UserHomePage: React.FC = () => {
    const { data: TrendingRes } = useGetTrendingHotels();
    const hotels = TrendingRes?.data || []
    return (
        <div className="">
            <Header />
            <HeroBanner />
            <LuxuryProperties hotels={hotels} />
            <div className='h-[1px] bg-gray-300 w-[95%]'/>
            <TravelLocation />
            <Footer />
        </div>
    );
};

export default UserHomePage;