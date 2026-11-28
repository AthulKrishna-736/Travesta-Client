interface EmptyStateProps {
    title: string;
    description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
    return (
        <div className="flex w-fit min-w-0 flex-col items-center justify-center px-4 py-8 text-center h-fit">

            {/* Compact Hotel Illustration */}
            <div className="relative mb-4 h-28 w-36 shrink-0">

                <div className="absolute inset-x-3 bottom-1 top-2 rounded-full bg-slate-50" />

                {/* Left Building */}
                <div className="absolute bottom-2 left-2 h-12 w-9 rounded-t-md border border-slate-200 bg-slate-100">
                    <div className="grid grid-cols-2 gap-1 p-1.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-2 rounded-sm bg-slate-200" />
                        ))}
                    </div>
                </div>

                {/* Main Hotel */}
                <div className="absolute bottom-2 left-1/2 z-10 h-[76px] w-[58px] -translate-x-1/2 rounded-t-lg border border-slate-200 bg-white shadow-sm">
                    <div className="grid grid-cols-3 gap-1.5 px-2 pt-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-2.5 rounded-sm border border-slate-100 bg-slate-100" />
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-1/2 h-5 w-4 -translate-x-1/2 rounded-t-sm bg-indigo-100" />
                </div>

                {/* Right Building */}
                <div className="absolute bottom-2 right-2 h-14 w-9 rounded-t-md border border-slate-200 bg-slate-50">
                    <div className="grid grid-cols-2 gap-1 p-1.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-2 rounded-sm bg-slate-200" />
                        ))}
                    </div>
                </div>

                {/* Location Pin */}
                <div className="absolute right-3 top-0 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-100 bg-white shadow-sm">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4 text-indigo-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                        />
                        <circle cx="12" cy="10" r="2.5" />
                    </svg>
                </div>

                {/* Suitcase */}
                <div className="absolute bottom-1 right-0 z-20">
                    <div className="relative h-10 w-8 rounded-md border border-indigo-200 bg-indigo-50 shadow-sm">

                        {/* Handle */}
                        <div className="absolute -top-2 left-2 h-2 w-4 rounded-t border-2 border-indigo-300 border-b-0" />

                        {/* Front details */}
                        <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-indigo-200" />
                        <div className="absolute right-1 top-3 h-1 w-1 rounded-full bg-indigo-400" />

                        {/* Wheels */}
                        <div className="absolute -bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <div className="absolute -bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </div>
                </div>

                {/* Ground */}
                <div className="absolute bottom-1 left-1 right-1 h-px bg-slate-200" />
            </div>

            {/* Text */}
            <p className="text-sm font-semibold text-slate-700">
                {title}
            </p>

            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
                {description}
            </p>
        </div>
    );
};

export default EmptyState;
