import React from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserAboutPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="py-20 px-4">
                <div className="mx-auto max-w-6xl space-y-20">

                    {/* Hero */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
                            Hotels Across India,<br />
                            Simplified
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            From the Himalayas to Kerala's backwaters, discover stays that
                            match your journey across India's diverse landscapes and cultures.
                        </p>
                    </div>

                    {/* What We Do */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold text-slate-900">What We Do</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Travesta connects you with hotels across India. Search by location,
                            check weather forecasts, explore nearby attractions, and book instantly.
                            Everything you need to plan your stay, in one place.
                        </p>
                    </div>

                    {/* Core Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 space-y-3">
                                <MapPin className="w-8 h-8 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Smart Search</h3>
                                <p className="text-slate-600">
                                    Find hotels by location, filter by price and preferences,
                                    and see real reviews from travelers.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 space-y-3">
                                <Sparkles className="w-8 h-8 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Travel Tools</h3>
                                <p className="text-slate-600">
                                    Weather updates, maps for directions, and curated
                                    recommendations for local attractions.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 space-y-3">
                                <Shield className="w-8 h-8 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Secure Booking</h3>
                                <p className="text-slate-600">
                                    Safe online payments, instant confirmations,
                                    and easy access to your booking history.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 space-y-3">
                                <Heart className="w-8 h-8 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Made for You</h3>
                                <p className="text-slate-600">
                                    Subscription benefits, wallet rewards, and support
                                    whenever you need it.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* For Hotel Partners */}
                    <div className="bg-slate-100 rounded-2xl p-10 space-y-6">
                        <h2 className="text-3xl font-semibold text-slate-900">For Hotel Owners</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            List your property on Travesta and reach travelers across India.
                            Manage bookings, track performance, and grow your business with
                            tools designed for hospitality professionals.
                        </p>
                        <Button onClick={() => navigate('/vendor/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
                            Become a Partner
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserAboutPage;
