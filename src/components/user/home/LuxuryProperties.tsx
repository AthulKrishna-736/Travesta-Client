import React from 'react'

type TLuxuryHotels = {
    image: string;
    title: string;
    description: string;
}

interface ILuxuryProperties {
    hotels?: TLuxuryHotels[]
}

const hotels = [
    {
        image: "https://www.keralatourism.org/images/service-providers/photos/property-2326-profile-1820-20180619110532.jpg",
        title: "Grand Palace Resort",
        description: "Experience timeless elegance with stunning ocean views."
    },
    {
        image: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2018/07/02/1034/Grand-Hyatt-Kochi-Bolgatty-P061-Hotel-Facade.jpg/Grand-Hyatt-Kochi-Bolgatty-P061-Hotel-Facade.16x9.jpg?imwidth=1920",
        title: "City Luxury Hotels",
        description: "Modern suites in the heart of the city with world-class amenities."
    },
    {
        image: "https://media1.thrillophilia.com/filestore/haoxguwzxijqpkx0nusei734r82h_3a32e5de-e5a0-439e-a842-459f1854ec7e.jpg?dpr=1.25&w=1536",
        title: "Mountain Escape Lodge",
        description: "Cozy luxury nestled in the serene mountain landscapes."
    },
]

const LuxuryProperties: React.FC<ILuxuryProperties> = () => {
    return (
        <div className='relative w-full h-50'>
            <div className='absolute w-full top-[-100px] z-10'>
                <div
                    className='container mx-auto p-4 flex justify-between rounded-md bg-white/80 bg-blend-overlay bg-cover bg-center shadow-[0_5px_10px_rgba(0,0,0,0.2)]'
                    style={{ backgroundImage: "url('https://thumbs.dreamstime.com/z/vector-abstract-texture-luxury-background-line-wave-organic-pattern-elegant-shape-design-gold-white-premium-graphics-leaves-319220832.jpg?ct=jpeg')" }}
                >
                    <div className='flex flex-col justify-center space-y-2 m-3 max-w-80'>
                        <h1 className='text-[#4a4a4a] uppercase font-bold text-2xl'>Introducing</h1>
                        <p className="bg-gradient-to-r from-[#e4c572] to-[#cfa741] bg-clip-text text-transparent font-bold text-5xl">
                            Luxury Hotel Collection
                        </p>
                    </div>

                    <div className='flex'>
                        {hotels && hotels.map((h) => {
                            return (
                                <div key={h.title} className='w-57 h-70 pb-5 m-2 bg-white rounded-md shadow-[0_1px_10px_rgba(0,0,0,0.2)] cursor-pointer'>
                                    <img src={h.image} alt='hotelImage' className='object-cover h-[70%] rounded-t-md transform transition duration-300 hover:scale-102' />
                                    <div className='pt-3 px-3'>
                                        <h3 className='font-bold text-lg'>{h.title}</h3>
                                        <p className=' text-[#4a4a4a] leading-tight text-sm line-clamp-2'>
                                            {h.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LuxuryProperties