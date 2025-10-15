import React from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import BookingCheckout from '@/components/booking/BookingCheckout';

const UserCheckoutPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#f2f2f2]">
                <BookingCheckout />
            </main>
            <Footer />
        </div>
    );
};

export default UserCheckoutPage;
