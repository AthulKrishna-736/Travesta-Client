import React from 'react';
import Footer from '@/components/footer/Footer';
import HotelSearchHero from '@/components/home/HeroBanner';
import TravelLocation from '@/components/home/TravelLocations';
import LandingHeader from '@/components/header/user/LandingHeader';
import { useGetTrendingHotels } from '@/hooks/vendor/useHotel';
import LuxuryProperties from '@/components/home/TrendingProperties';

const LandingPage: React.FC = () => {
    const { data: TrendingRes } = useGetTrendingHotels();
    const hotels = TrendingRes?.data || [];

    return (
        <div>
            <LandingHeader />
            <HotelSearchHero />
            <LuxuryProperties hotels={hotels} />
            <div className='h-[1px] bg-gray-300 w-[95%] mx-auto my-5' />
            <TravelLocation />
            <Footer />
        </div>
    );
};

export default LandingPage;
