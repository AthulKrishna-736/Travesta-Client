interface EmptyStateProps {
    title: string;
    description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-14 px-4">

            {/* Hotel & Travel Illustration */}
            <div className="relative w-48 h-36 mb-6">

                {/* Soft background */}
                <div className="absolute w-32 h-32 rounded-full bg-gray-50 left-8 top-1" />

                {/* Back building */}
                <div className="absolute left-5 top-8 w-12 h-16 rounded-t-md border border-gray-200 bg-gray-100">
                    <div className="grid grid-cols-2 gap-1.5 p-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-2.5 rounded-[2px] bg-gray-200" />
                        ))}
                    </div>
                </div>

                {/* Main hotel building */}
                <div className="absolute left-14 top-3 w-20 h-24 rounded-t-lg border border-gray-200 bg-white shadow-sm z-10">

                    {/* Roof */}
                    <div className="absolute -top-1.5 left-3 right-3 h-1.5 rounded-t bg-gray-300" />

                    {/* Windows */}
                    <div className="grid grid-cols-3 gap-1.5 px-3 pt-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-3 rounded-[2px] bg-gray-100 border border-gray-200"
                            />
                        ))}
                    </div>

                    {/* Entrance */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-6 rounded-t-md bg-gray-200 border border-gray-300" />
                </div>

                {/* Small building */}
                <div className="absolute right-3 top-11 w-11 h-16 rounded-t-md border border-gray-200 bg-gray-50 z-0">
                    <div className="grid grid-cols-2 gap-1.5 p-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-2 rounded-[2px] bg-gray-200" />
                        ))}
                    </div>
                </div>

                {/* Suitcase */}
                <div className="absolute bottom-2 right-5 z-20">
                    <div className="relative w-11 h-12 rounded-md bg-gray-100 border border-gray-300 shadow-sm">
                        <div className="absolute -top-3 left-3 w-5 h-3 rounded-t border-2 border-gray-300 border-b-0" />
                        <div className="absolute top-0 bottom-0 left-2 w-px bg-gray-300" />
                        <div className="absolute top-4 right-2 w-1 h-1 rounded-full bg-gray-400" />
                        <div className="absolute -bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
                    </div>
                </div>

                {/* Location marker */}
                <div className="absolute top-0 right-5 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full border-2 border-gray-400" />
                </div>

                {/* Decorative details */}
                <div className="absolute top-5 left-2 w-1.5 h-1.5 rounded-full bg-gray-300" />
                <div className="absolute bottom-5 left-9 w-2 h-2 rounded-full bg-gray-200" />
                <div className="absolute top-9 right-0 w-1.5 h-1.5 rounded-full bg-gray-300" />

                {/* Ground */}
                <div className="absolute bottom-1 left-3 right-3 h-px bg-gray-200" />
            </div>

            {/* Empty State Text */}
            <p className="text-sm font-medium text-gray-600">
                {title}
            </p>

            <p className="text-xs text-gray-400 mt-1.5 text-center max-w-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default EmptyState;
