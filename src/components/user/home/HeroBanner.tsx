import SearchForm from "./SearchForm";

const HeroBanner = () => {
    return (
        <div className="relative h-[600px] lg:h-[700px] w-full overflow-hidden">
            {/* Background Image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2349&q=80)'
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative text-center h-full">
                <div className="flex justify-center items-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white my-20 lg:py-20">
                        Find Your Perfect Stay,
                        <p>Compare and Save</p>
                    </h1>
                </div>

                <SearchForm />
            </div>
        </div>
    );
};

export default HeroBanner;
