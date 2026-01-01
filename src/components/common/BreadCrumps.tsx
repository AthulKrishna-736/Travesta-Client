import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
    const navigate = useNavigate();

    return (
        <div className="text-sm flex items-center flex-wrap mb-2">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <React.Fragment key={index}>
                        <span
                            className={`${isLast
                                ? "text-blue-600 font-semibold"
                                : "text-black hover:text-blue-600 cursor-pointer"
                                }`}
                            onClick={() => !isLast && item.path && navigate(item.path)}
                        >
                            {item.label}
                        </span>
                        {!isLast && (
                            <ChevronRightIcon className="w-3 h-3 mx-1 mt-[3px] text-black" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
