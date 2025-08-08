import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BookingCheckout from '@/components/booking/BookingCheckout';

const UserCheckoutPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gray-50">
                <BookingCheckout />
            </main>
            <Footer />
        </div>
    );
};

export default UserCheckoutPage;
