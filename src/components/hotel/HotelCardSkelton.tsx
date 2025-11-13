
const HotelCardSkelton = () => {
    return (
        <div className="bg-white rounded-xs w-full h-55 flex p-4 my-4 outline-1 outline-[#e1e1e1] hover:outline-[#0084ff]">
            {/* Image skelton */}
            <div className="w-52 flex flex-col h-full gap-1">
                <div className="h-3/4 w-full object-cover rounded-sm bg-gray-400 animate-pulse" />
                <div className="h-1/4 w-full flex justify-between gap-1">
                    <div className="h-full w-1/4 bg-gray-300 rounded-sm animate-pulse"></div>
                    <div className="h-full w-1/4 bg-gray-300 rounded-sm animate-pulse"></div>
                    <div className="h-full w-1/4 bg-gray-300 rounded-sm animate-pulse"></div>
                    <div className="h-full w-1/4 bg-gray-300 rounded-sm animate-pulse"></div>
                </div>
            </div>

            {/* Hotel details */}
            <div className="px-4 mx-2 flex-1 flex flex-col justify-around gap-3">
                <div className="w-1/2 h-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="w-[95%] h-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="w-[80%] h-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="w-[85%] h-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-1/4 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    )
}

export default HotelCardSkelton;