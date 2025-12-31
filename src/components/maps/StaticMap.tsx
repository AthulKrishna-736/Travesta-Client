import { useGetStaticMap } from '@/hooks/admin/useService'
import { StaticMapProps } from '@/types/custom.types';
import React, { useEffect } from 'react'


const StaticMap: React.FC<StaticMapProps> = ({ lat, long, zoom, height, width, format }) => {
    const { data, isLoading } = useGetStaticMap(long, lat, zoom, width, height, format, true);

    useEffect(() => {
        return () => {
            if (data) {
                URL.revokeObjectURL(data);
            }
        };
    }, [data]);

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