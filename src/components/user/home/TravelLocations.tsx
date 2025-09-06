import React from 'react';

interface TLocations {
    name: string;
    image: string;
    description: string;
}

interface ITravelLocation {
    locations: TLocations[]
}

const TravelLocation: React.FC<ITravelLocation> = ({ locations }) => {

    return (
        <section className="bg-[#f1f1f1] py-10">
            <div className='container mx-auto bg-white rounded-md p-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 shadow-lg'>
                {locations.map((l) => {
                    return (
                        <div key={l.name} className='cursor-pointer m-2 p-2 rounded-md flex gap-2 hover:bg-gray-200 transition ease-in duration-300'>
                            <img
                                className=' w-14 h-14 object-cover rounded-full'
                                src={l.image}
                                alt={l.name}
                            />
                            <div className='text-white'>
                                <h3 className='text-[#4a4a4a] font-semibold text-xl'>{l.name}</h3>
                                <p className='text-[#4a4a4a] font-light max-w-40 truncate tracking-tight'>{l.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TravelLocation;
