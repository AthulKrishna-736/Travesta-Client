import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'

type TSortTypes = {
    name: string,
    tooltip: string,
    onClickHandler: () => void,
    icon?: LucideIcon,
}

interface CustomSortProps {
    data: TSortTypes[]
}

const CustomSort: React.FC<CustomSortProps> = ({ data }) => {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div className="flex items-center bg-white shadow-md rounded-xs gap-3">
            <span className="text-[#4a4a4a] font-bold mx-4 text-sm uppercase">
                Sort by
            </span>
            <div className='flex py-4 divide-x divide-gray-300'>
                {data.map((s) => {
                    const isActive = active == s.name
                    return (
                        <button
                            key={s.name}
                            title={s.tooltip}
                            onClick={() => {
                                setActive(s.name)
                                s.onClickHandler();
                            }}
                            className={`px-10 cursor-pointer text-sm font-medium  ${isActive ? 'text-[#008eff] bg-[#eaf5ff]' : 'text-[#4a4a4a]'}`}
                        >
                            {s.name}
                        </button>

                    );
                })}
            </div>
        </div>
    );
}

export default CustomSort;