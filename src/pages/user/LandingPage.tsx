import React from 'react';
import Footer from '@/components/footer/Footer';
import HeroBanner from '@/components/user/home/HeroBanner';
import SearchForm from '@/components/user/home/SearchForm';
import PopularDestinations from '@/components/user/home/PopularDestination';
import Features from '@/components/user/home/Features';
import Newsletter from '@/components/user/home/Newsletter';
import LandingHeader from '@/components/header/user/LandingHeader';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-grow">
                <HeroBanner />
                <div className="container mx-auto px-4">
                    <SearchForm />
                </div>
                <PopularDestinations />
                <Features />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
