import React from 'react';
import { Search, Hotel, Star } from "lucide-react";

interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
    <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-50 to-white rounded-full flex items-center justify-center mb-4">
            <div className="w-10 h-10 text-blue-500">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
    </div>
);

const Features = () => {
    return (
        <section className="py-16 bg-gradient-to-t from-white via-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Why Book with Travesta</h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        We make finding your perfect stay easy, affordable, and hassle-free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Feature
                        icon={<Search className="w-full h-full" />}
                        title="Compare Prices"
                        description="Search and compare hotel prices across hundreds of travel sites at once"
                    />
                    <Feature
                        icon={<Hotel className="w-full h-full" />}
                        title="Extensive Selection"
                        description="Choose from over 2 million accommodations worldwide"
                    />
                    <Feature
                        icon={<Star className="w-full h-full" />}
                        title="Verified Reviews"
                        description="Read genuine reviews from millions of verified guests"
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;
