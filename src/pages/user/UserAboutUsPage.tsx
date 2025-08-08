import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UserAboutPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Card className="shadow-lg border-0 bg-white">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-blue-600">
                                About Travesta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                Travesta was born out of a desire to simplify the way people discover and book hotels.
                                We envisioned a platform that not only connects travelers to the perfect rooms,
                                but also provides a seamless, personalized, and intuitive booking experience.
                            </p>

                            <p>
                                Whether you're planning a weekend getaway, a business trip, or a luxurious retreat,
                                Travesta lets you book rooms that match your needs with filters, real-time availability, and verified listings.
                                Our mission is to take the hassle out of hotel hunting, so you can focus on enjoying your journey.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-blue-800">User-Centric Design</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            Our platform is designed with simplicity and user experience in mind fast searches, beautiful visuals, and mobile-ready features.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-blue-800">Smart Booking Engine</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            Powered by intelligent filters and curated data, Travesta ensures you see the most relevant rooms based on your preferences.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-blue-800">Secure & Reliable</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            We prioritize your security with encrypted transactions and verified hotel partners.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-blue-800">24/7 Support</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            Got questions or need help? Our support team is available around the clock to assist you.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="text-center mt-10">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3">
                                    Start Booking with Travesta
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserAboutPage;
