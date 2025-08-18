import { LucideIcon } from 'lucide-react'
import React from 'react'

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
    return (
        <div className="flex items-center p-4 m-4 bg-white border-t-3 border-blue-400 rounded-md shadow-md gap-3">
            <span className="text-gray-600 font-bold text-md uppercase">
                Sort by:
            </span>
            {data.map((s) => {
                const Icon = s.icon;
                return (
                    <button
                        key={s.name}
                        title={s.tooltip}
                        onClick={() => s.onClickHandler()}
                        className="flex items-center gap-2 px-3 py-2 rounded-md border border-black text-black hover:bg-blue-100 hover:text-blue-600 hover:shadow-sm transition-colors"
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span className="text-sm font-medium">{s.name}</span>
                    </button>

                );
            })}
        </div>
    );
}

export default CustomSort;