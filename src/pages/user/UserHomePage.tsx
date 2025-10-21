import React from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import HeroBanner from '@/components/user/home/HeroBanner';
import Features from '@/components/user/home/Features';
import Newsletter from '@/components/user/home/TravelLocations';
import LuxuryProperties from '@/components/user/home/LuxuryProperties';


const UserHomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-[#f1f1f1]">
                <HeroBanner />
                <LuxuryProperties />
                <Features />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default UserHomePage;