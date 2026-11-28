interface EmptyChartProps {
    message?: string;
}

const EmptyChart = ({
    message = "No data available",
}: EmptyChartProps) => {
    return (
        <div className="flex h-[300px] w-full flex-col items-center justify-center gap-5">

            {/* Abstract chart illustration */}
            <div className="relative h-36 w-56 opacity-60">

                {/* Background decorative circle */}
                <div className="absolute left-16 top-1 h-32 w-32 rounded-full bg-gray-100" />

                {/* Bar chart card */}
                <div className="absolute left-2 top-7 flex h-24 w-32 items-end gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="h-7 w-4 rounded-t-md bg-gray-200" />
                    <div className="h-12 w-4 rounded-t-md bg-gray-300" />
                    <div className="h-9 w-4 rounded-t-md bg-gray-200" />
                    <div className="h-16 w-4 rounded-t-md bg-gray-300" />
                    <div className="h-11 w-4 rounded-t-md bg-gray-200" />
                </div>

                {/* Pie chart */}
                <div className="absolute right-2 top-1 flex h-14 w-14 items-center justify-center rounded-full border-[9px] border-gray-200 bg-gray-50">
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                </div>

                {/* Mini chart card */}
                <div className="absolute bottom-0 right-3 flex h-12 w-20 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
                    <svg viewBox="0 0 80 35" className="h-8 w-16">
                        <path
                            d="M2 28 L18 18 L30 23 L45 8 L58 16 L76 4"
                            fill="none"
                            stroke="#D1D5DB"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Floating dots */}
                <div className="absolute left-1 top-2 h-3 w-3 rounded-full bg-gray-300" />
                <div className="absolute bottom-5 left-0 h-5 w-5 rounded-full bg-gray-200" />
                <div className="absolute right-0 bottom-16 h-2 w-2 rounded-full bg-gray-300" />

            </div>

            {/* Empty state text */}
            <div className="flex flex-col items-center gap-1">
                <h3 className="text-sm font-semibold text-gray-600">
                    {message}
                </h3>
                <p className="text-xs text-gray-400">
                    There is no data to display yet.
                </p>
            </div>
        </div>
    );
};

export default EmptyChart;
