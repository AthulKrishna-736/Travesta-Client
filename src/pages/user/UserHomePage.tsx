import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroBanner from '@/components/user/home/HeroBanner';
import SearchForm from '@/components/user/home/SearchForm';
import PopularDestinations from '@/components/user/home/PopularDestination';
import SpecialOffers from '@/components/user/home/SpecialOffers';
import Features from '@/components/user/home/Features';
import Newsletter from '@/components/user/home/Newsletter';


const UserHomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <HeroBanner />
                <div className="container mx-auto px-4">
                    <SearchForm />
                </div>
                <PopularDestinations />
                <SpecialOffers />
                <Features />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default UserHomePage;