import { Button } from "@/components/ui/button";

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
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative container mx-auto h-full flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl animate-fade-in">
                    Find Your Perfect Stay, <span className="text-traveste-300">Compare and Save</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-slide-in">
                    Compare prices from over 200+ booking sites to find the best deals on hotels worldwide
                </p>
                <Button className="bg-traveste-500 hover:bg-traveste-600 text-white px-8 py-6 text-lg rounded-full">
                    Start Exploring
                </Button>
            </div>
        </div>
    );
};

export default HeroBanner;
