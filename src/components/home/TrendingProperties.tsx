import React from 'react';
import TrendingHotels from '@/components/hotel/TrendingHotels';
import { useNavigate } from 'react-router-dom';

interface ITrendingProperties {
    hotels?: any[];
}

const TrendingProperties: React.FC<ITrendingProperties> = ({ hotels }) => {
    const navigate = useNavigate();

    return (
        <div className='w-full h-full flex flex-col gap-6 bg-white p-8'>
            <div className='text-center font-normal text-5xl my-10'>
                Explore Stays, About Comfort, Your Stay <br /> Our Priority
            </div>

            {/* hotels cards */}
            <div className='flex flex-col w-full h-full lg:flex-row gap-4'>
                <div className='w-full lg:w-1/4 flex flex-col gap-3'>
                    <button className='w-1/4 outline-1 outline-gray-300 rounded-xl cursor-pointer' onClick={() => navigate('/user/about-us')}>
                        About Us
                    </button>
                    <h1 className='text-3xl font-medium text-left leading-8'>
                        Travesta is a trusted platform connecting travelers with top hotels throughout India
                    </h1>
                </div>

                <div className='w-full lg:w-3/4 flex flex-col md:flex-row h-full justify-around'>
                    <div className='w-full md:w-120 h-90'>
                        {hotels && hotels.length > 0 && (
                            <TrendingHotels key={hotels[0].id || hotels[0]._id} hotel={hotels[0]} />
                        )}
                    </div>
                    <div className='w-full flex flex-col gap-8 md:w-80 h-full my-4'>
                        {hotels && hotels.length > 0 && hotels.slice(1).map((h) => (
                            <TrendingHotels key={h.id || h._id} hotel={h} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendingProperties;
