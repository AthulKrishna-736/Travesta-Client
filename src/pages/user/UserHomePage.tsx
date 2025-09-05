import React from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import HeroBanner from '@/components/user/home/HeroBanner';
import PopularDestinations from '@/components/user/home/PopularDestination';
import Features from '@/components/user/home/Features';
import Newsletter from '@/components/user/home/Newsletter';


const UserHomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <HeroBanner />
                <PopularDestinations />
                <Features />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default UserHomePage;