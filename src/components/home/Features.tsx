import { Search, Percent, Shield } from "lucide-react";

const Features = () => {
    return (
        <section className="py-10 bg-white mx-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Why Book with Us
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Simple, reliable, and designed for travelers like you
                    </p>
                </div>

                {/* Feature 1 - Image Left */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16">
                    <div className="w-full md:w-1/2">
                        <div className="rounded-md overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1506059612708-99d6c258160e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169https://images.unsplash.com/photo-1506059612708-99d6c258160e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169"
                                alt="Search hotels"
                                className="w-full h-72 object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">Compare & Save</h3>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Search thousands of hotels and compare prices from multiple booking sites instantly. We help you find the best deal without the hassle of checking each site separately.
                        </p>
                    </div>
                </div>

                {/* Feature 2 - Image Right */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 mb-16">
                    <div className="w-full md:w-1/2">
                        <div className="rounded-md overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
                                alt="Best prices"
                                className="w-full h-72 object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                <Percent className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">Best Prices Always</h3>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Get guaranteed lowest prices on your bookings. No hidden fees, no surprise charges. What you see is what you pay, with exclusive deals and discounts available daily.
                        </p>
                    </div>
                </div>

                {/* Feature 3 - Image Left */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16">
                    <div className="w-full md:w-1/2">
                        <div className="rounded-md overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1562790351-d273a961e0e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765"
                                alt="Secure booking"
                                className="w-full h-72 object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">Safe & Secure</h3>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Your information is protected with industry-leading security. Read verified reviews from real travelers and get 24/7 customer support whenever you need help.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;