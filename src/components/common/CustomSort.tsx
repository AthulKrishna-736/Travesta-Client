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
        <div className="flex items-center bg-white rounded-sm gap-2 p-2 overflow-x-auto">
            <span className="text-[#4a4a4a] font-bold mx-2 text-xs sm:text-sm uppercase whitespace-nowrap">
                Sort by
            </span>

            <div className="flex flex-nowrap justify-between w-full sm:flex-wrap gap-1 sm:gap-0">
                <div>
                    {data.map((s) => {
                        const isActive = active === s.name;

                        return (
                            <button
                                key={s.name}
                                title={s.tooltip}
                                onClick={() => {
                                    setActive(s.name);
                                    s.onClickHandler();
                                }}
                                className={`cursor-pointer rounded-sm whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-2 sm:px-6 transition-colors ${isActive ? "text-[#008eff] bg-[#eaf5ff]" : "text-[#4a4a4a] hover:bg-gray-100"}`}
                            >
                                {s.name}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setActive(null)}
                    className="cursor-pointer whitespace-nowrap rounded-sm px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                    Clear filters
                </button>
            </div>
        </div>
    );
}

export default CustomSort;