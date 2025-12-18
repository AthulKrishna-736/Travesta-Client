import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TLocation {
    name: string;
    image: string;
    description: string;
    coordinates: { lat: number, long: number }
}

interface ITravelLocation {
    locations?: TLocation[]
}

const locations: TLocation[] = [
    {
        name: "Taj Mahal",
        image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?cs=srgb&dl=pexels-sudipta-1603650.jpg&fm=jpg",
        description: "Marble love symbol",
        coordinates: { lat: 27.175008, long: 78.042101 },
    },
    {
        name: "Jaipur",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU8BjHVt0bg_BOXV3M9D29mPyzySj_lnMG7Q&s",
        description: "Pink city charm",
        coordinates: { lat: 26.915458, long: 75.818982 },
    },
    {
        name: "Varanasi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR61Q_W1XsRfvtxJi1OLtF_Rc6Ng7ZWdaA13A&s",
        description: "Sacred Ganga ghats",
        coordinates: { lat: 25.335649, long: 83.007629 },
    },
    {
        name: "Goa",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyugRRVWstbFafv9fP-2cGb5YCFpuIvzg-pA&s",
        description: "Beaches and fun",
        coordinates: { lat: 15.300454, long: 74.085513 },
    },
    {
        name: "Alappuzha",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpeKbjfJSQJlnABkqrNdky2EYbs6wlLcV8Lg&s",
        description: "God’s own land",
        coordinates: { lat: 9.500665, long: 76.412414 },
    },
    {
        name: "Amritsar",
        image: "https://www.shutterstock.com/image-photo/sikh-gurdwara-golden-temple-harmandir-600nw-2481628943.jpg",
        description: "Golden temple glow",
        coordinates: { lat: 31.635666, long: 74.87875 },
    },
    {
        name: "Rishikesh",
        image: "https://cdn.pixabay.com/photo/2022/10/05/07/11/temple-7499927_1280.jpg",
        description: "Yoga capital town",
        coordinates: { lat: 30.108654, long: 78.291619 },
    },
    {
        name: "Udaipur",
        image: "https://cdn.pixabay.com/photo/2018/03/15/22/02/udaipur-3229676_1280.jpg",
        description: "Lake city beauty",
        coordinates: { lat: 24.578721, long: 73.686257 },
    },
    {
        name: "Delhi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVVkHL2jdaTWb-pLEImto0UfUk2AolHqxLeg&s",
        description: "India’s capital hub",
        coordinates: { lat: 28.6138954, long: 77.2090057 },
    },
    {
        name: "Mysore",
        image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXlzb3JlfGVufDB8fDB8fHww",
        description: "Palace city pride",
        coordinates: { lat: 12.3051828, long: 76.6553609 },
    },
    {
        name: "Hampi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtGo8NLoVvfTek2O3R77AuJPHCjpISkKfxUw&s",
        description: "Ancient ruins site",
        coordinates: { lat: 15.3358, long: 76.4610201 },
    },
    {
        name: "Darjeeling",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwY6TOS7xmRqJlkjeSDSWMgSyvgivri9HeA&s",
        description: "Tea garden hills",
        coordinates: { lat: 27.0377554, long: 88.263176 },
    },
    {
        name: "Manali",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhAYW1OHRdw0O8QodT8E_8dTXsTOa8HbZTiw&s",
        description: "Snowy mountain fun",
        coordinates: { lat: 32.2454608, long: 77.1872926 },
    },
    {
        name: "Khajuraho",
        image: "https://plus.unsplash.com/premium_photo-1697730370661-51bf72769ff6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2hhanVyYWhvfGVufDB8fDB8fHww",
        description: "Temple art carvings",
        coordinates: { lat: 24.8515132, long: 79.9259786 },
    },
    {
        name: "Leh",
        image: "https://plus.unsplash.com/premium_photo-1661962344178-19930ba15492?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGFkYWtofGVufDB8fDB8fHww",
        description: "High mountain pass",
        coordinates: { lat: 34.1642029, long: 77.5848133 },
    },
];

const TravelLocation: React.FC<ITravelLocation> = () => {
    const navigate = useNavigate();

    const handleClickLocation = (location: TLocation) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const checkIn = today.toISOString().split('T')[0];
        const checkOut = tomorrow.toISOString().split('T')[0];

        const queryParams = new URLSearchParams({
            searchTerm: location.name ?? "My Location",
            lat: location.coordinates.lat.toString(),
            long: location.coordinates.long.toString(),
            checkIn,
            checkOut,
            adults: '1',
            children: '0',
            rooms: '1',
            minPrice: '0',
            maxPrice: '1500',
        });

        navigate(`/user/hotels/?${queryParams.toString()}`);
    }

    return (
        <section className='bg-white p-5'>
            <div className='text-center font-normal text-5xl mb-10'>
                Discover India Through Every Stay
            </div>
            <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2'>
                {locations && (locations.map((l) => {
                    return (
                        <div
                            key={l.name}
                            className='cursor-pointer m-2 p-2 rounded-md flex gap-3 hover:bg-gray-200 transition ease-in duration-300'
                            onClick={() => handleClickLocation(l)}
                        >
                            <img
                                className=' w-14 h-14 object-cover rounded-full'
                                src={l.image}
                                alt={l.name}
                            />
                            <div className='text-white'>
                                <h3 className='text-[#4a4a4a] font-semibold text-lg'>{l.name}</h3>
                                <p className='text-[#4a4a4a] font-light max-w-40 truncate tracking-tight'>{l.description}</p>
                            </div>
                        </div>
                    );
                }))}
            </div>
        </section >
    );
};

export default TravelLocation;
