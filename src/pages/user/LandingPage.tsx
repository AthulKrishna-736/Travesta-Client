import React from 'react';
import Footer from '@/components/footer/Footer';
import HeroBanner from '@/components/user/home/HeroBanner';
import PopularDestinations from '@/components/user/home/PopularDestination';
import Features from '@/components/user/home/Features';
import TravelLocation from '@/components/user/home/TravelLocations';
import LandingHeader from '@/components/header/user/LandingHeader';
import LuxuryProperties from '@/components/user/home/LuxuryProperties';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-grow">
                <HeroBanner />
                <LuxuryProperties />
                <PopularDestinations />
                <Features />
                <TravelLocation />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
