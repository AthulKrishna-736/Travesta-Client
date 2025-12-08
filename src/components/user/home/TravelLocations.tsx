import React from 'react';

interface TLocations {
    name: string;
    image: string;
    description: string;
}

interface ITravelLocation {
    locations?: TLocations[]
}

const locations = [
    {
        name: "Taj Mahal",
        image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?cs=srgb&dl=pexels-sudipta-1603650.jpg&fm=jpg",
        description: "Marble love symbol",
    },
    {
        name: "Jaipur",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU8BjHVt0bg_BOXV3M9D29mPyzySj_lnMG7Q&s",
        description: "Pink city charm",
    },
    {
        name: "Varanasi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR61Q_W1XsRfvtxJi1OLtF_Rc6Ng7ZWdaA13A&s",
        description: "Sacred Ganga ghats",
    },
    {
        name: "Goa",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyugRRVWstbFafv9fP-2cGb5YCFpuIvzg-pA&s",
        description: "Beaches and fun",
    },
    {
        name: "Kerala",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpeKbjfJSQJlnABkqrNdky2EYbs6wlLcV8Lg&s",
        description: "God’s own land",
    },
    {
        name: "Amritsar",
        image: "https://www.shutterstock.com/image-photo/sikh-gurdwara-golden-temple-harmandir-600nw-2481628943.jpg",
        description: "Golden temple glow",
    },
    {
        name: "Rishikesh",
        image: "https://cdn.pixabay.com/photo/2022/10/05/07/11/temple-7499927_1280.jpg",
        description: "Yoga capital town",
    },
    {
        name: "Udaipur",
        image: "https://cdn.pixabay.com/photo/2018/03/15/22/02/udaipur-3229676_1280.jpg",
        description: "Lake city beauty",
    },
    {
        name: "Delhi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVVkHL2jdaTWb-pLEImto0UfUk2AolHqxLeg&s",
        description: "India’s capital hub",
    },
    {
        name: "Mysore",
        image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXlzb3JlfGVufDB8fDB8fHww",
        description: "Palace city pride",
    },
    {
        name: "Hampi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtGo8NLoVvfTek2O3R77AuJPHCjpISkKfxUw&s",
        description: "Ancient ruins site",
    },
    {
        name: "Darjeeling",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwY6TOS7xmRqJlkjeSDSWMgSyvgivri9HeA&s",
        description: "Tea garden hills",
    },
    {
        name: "Manali",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhAYW1OHRdw0O8QodT8E_8dTXsTOa8HbZTiw&s",
        description: "Snowy mountain fun",
    },
    {
        name: "Khajuraho",
        image: "https://plus.unsplash.com/premium_photo-1697730370661-51bf72769ff6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2hhanVyYWhvfGVufDB8fDB8fHww",
        description: "Temple art carvings",
    },
    {
        name: "Leh",
        image: "https://plus.unsplash.com/premium_photo-1661962344178-19930ba15492?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGFkYWtofGVufDB8fDB8fHww",
        description: "High mountain pass",
    },
];

const TravelLocation: React.FC<ITravelLocation> = () => {

    return (
        <section className="bg-[#f1f1f1] py-10 px-10">
            <div className='container mx-auto bg-white rounded-md p-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2'>
                {locations && (locations.map((l) => {
                    return (
                        <div key={l.name} className='cursor-pointer m-2 p-2 rounded-md flex gap-3 hover:bg-gray-200 transition ease-in duration-300'>
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
        </section>
    );
};

export default TravelLocation;
