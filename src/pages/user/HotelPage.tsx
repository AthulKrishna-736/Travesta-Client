import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HotelCard from '@/components/user/Hotelslist';

const dummyHotels = [
    {
        _id: '1',
        vendorId: 'v001',
        name: 'Tranquil Woods Resort',
        description: 'Escape to the serene woods with luxury cottages and spa services.',
        images: ['https://source.unsplash.com/800x600/?resort,nature'],
        rating: 4.6,
        services: ['Room Service', 'Spa', 'Free Wi-Fi'],
        amenities: ['Swimming Pool', 'Parking', '24x7 Reception', 'Fitness Center'],
        tags: ['Nature', 'Luxury', 'Eco-Friendly'],
        state: 'Kerala',
        city: 'Munnar',
        address: 'Hilltop Road, Near Tea Estate, Munnar, Kerala',
        geoLocation: [10.0889, 77.0595],
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '2',
        vendorId: 'v002',
        name: 'City Palace Inn',
        description: 'Modern hotel located in the heart of the city with premium rooms.',
        images: ['https://source.unsplash.com/800x600/?hotel,room'],
        rating: 4.2,
        services: ['Breakfast Included', 'Laundry', 'Airport Shuttle'],
        amenities: ['Gym', 'Elevator', 'Lounge Bar'],
        tags: ['City', 'Business', 'Comfort'],
        state: 'Maharashtra',
        city: 'Mumbai',
        address: 'Downtown Business Park, Andheri East, Mumbai',
        geoLocation: [19.076, 72.8777],
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '3',
        vendorId: 'v003',
        name: 'Beachfront Paradise Hotel',
        description: 'Enjoy breathtaking sunsets from our sea-view rooms with private balconies.',
        images: ['https://source.unsplash.com/800x600/?beach,resort'],
        rating: 4.8,
        services: ['Private Beach', 'Breakfast Buffet', 'Bike Rentals'],
        amenities: ['Beach Access', 'Bar', 'Free Parking'],
        tags: ['Beach', 'Romantic', 'Couples'],
        state: 'Goa',
        city: 'Vagator',
        address: 'Near Sunset Point, Vagator Beach, Goa',
        geoLocation: [15.5917, 73.7386],
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];


const UserHotelPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8 text-traveste-700">Explore Our Hotels</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dummyHotels.map((hotel) => (
                            <HotelCard key={hotel._id} hotel={hotel} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserHotelPage;
