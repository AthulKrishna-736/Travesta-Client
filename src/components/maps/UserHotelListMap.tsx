import React, { memo, RefObject, useEffect, useRef } from 'react'
import { OlaMaps } from 'olamaps-web-sdk'
import { env } from '@/config/config'
import { X } from 'lucide-react';

interface IUserHotelListProps {
    mapModalRef: RefObject<HTMLDialogElement | null>;
    handleCloseModal: () => void;
    longitude: number;
    latitude: number;
    hotels: { hotelName: string, price: number, coordinates: [number, number] }[];
}

const UserHotelListMap: React.FC<IUserHotelListProps> = ({ mapModalRef, hotels, handleCloseModal, longitude, latitude }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const olaMaps = new OlaMaps({
            apiKey: env.OLA_API_SECRET,
        });

        const myMap = olaMaps.init({
            container: mapRef.current,
            style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            center: [longitude, latitude],
            zoom: 11,
            minZoom: 10,
            maxZoom: 13,
            language: "en",
        })

        myMap.doubleClickZoom.disable();
        myMap.touchZoomRotate.disable();
        myMap.dragRotate.disable();

        myMap.on('load', () => {
            const radiusKm = 15;

            const latDelta = radiusKm / 111;
            const lngDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

            const southWest = [longitude - lngDelta, latitude - latDelta];
            const northEast = [longitude + lngDelta, latitude + latDelta];

            myMap.setMaxBounds([southWest, northEast]);

            hotels.forEach((h) => {
                const popup = olaMaps
                    .addPopup({ offset: [0, -30], anchor: 'bottom' })
                    .setHTML(`
                        <div>
                            <h6 style="font-size: 16px; font-weight: 200;">
                                ${h.hotelName}
                            </h6>
                            <p style="font-size: 20px; font-weight: 700;">
                                ₹ ${h.price}
                            </p>
                        </div>`
                    )

                olaMaps
                    .addMarker({ anchor: "bottom" })
                    .setLngLat(h.coordinates)
                    .setPopup(popup)
                    .addTo(myMap);
            });
        })

        return () => {
            myMap.remove?.()
        }
    }, [latitude, longitude, hotels]);


    return (
        <dialog ref={mapModalRef} className='w-[95%] bg-white absolute z-40 top-20 mx-auto h-[85%] p-5 rounded-md'>
            <div className='w-full flex justify-between items-center h-[5%]'>
                <span className="text-lg text-gray-800">
                    Click a map pin to see the hotel's name, and price
                </span>
                <button onClick={handleCloseModal}><X className='w-6 h-6 hover:bg-red-500 hover:text-white rounded-sm' /></button>
            </div>
            <div ref={mapRef} className=' w-full h-[95%]' />
        </dialog>
    )
}

export default memo(UserHotelListMap);