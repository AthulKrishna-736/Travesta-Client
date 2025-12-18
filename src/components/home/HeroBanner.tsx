import SearchForm from "./SearchForm";

const HotelSearchHero = () => {
    return (
        <div className="relative h-[800px] md:h-[700px] p-5 bg-white w-full">
            <div
                className="relative h-full w-full rounded-xl bg-cover bg-no-repeat bg-center"
                style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1445019980597-93fa8acb246c")`,
                }}
            >
                <div className="absolute inset-0 rounded-xl bg-black/45" />
                <div className="absolute flex w-full justify-center items-center h-[40%] text-white font-normal text-5xl text-center tracking-tight" >
                    Discover Top Hotels, Compare Deals, and <br />Book Your Perfect Stay
                </div>

                <div className="w-full h-[97%] flex justify-center items-end">
                    <SearchForm />
                </div>
            </div>
        </div>
    );
};

export default HotelSearchHero;
