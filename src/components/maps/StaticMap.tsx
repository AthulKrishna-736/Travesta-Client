import { useGetStaticMap } from '@/hooks/admin/useMap'
import React from 'react'

interface StaticMapProps {
    long: number,
    lat: number,
}

const StaticMap: React.FC<StaticMapProps> = ({ lat, long }) => {
    const ZOOM = 17;
    const HEIGHT = 720;
    const WIDTH = 1280;
    const FORMAT = 'png';
    const { data, isLoading } = useGetStaticMap(long, lat, ZOOM, WIDTH, HEIGHT, FORMAT);

    return (
        <div>
            {isLoading ? (
                <div>
                    Map is loading...
                </div>
            ) : (
                <div>
                    {data && (
                        <img className='w-full h-full object-cover rounded-sm' src={data} alt="staticMap" />
                    )}
                </div>
            )
            }
        </div>
    )
}

export default StaticMap;