import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from '@/utils/customToast';

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !email.includes('@')) {
            showError("Please enter a valid email address");
            return;
        }

        showSuccess("You've been subscribed to our newsletter");

        setEmail('');
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="rounded-2xl overflow-hidden relative">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80)'
                        }}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 gradient-bg opacity-90"></div>
                    </div>

                    {/* Content */}
                    <div className="relative p-8 md:p-12">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                                Get Exclusive Travel Deals
                            </h2>
                            <p className="text-white/90 text-lg mb-8">
                                Subscribe to our newsletter and be the first to receive special offers and travel inspiration
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                <Input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-grow bg-white/90 border-0 placeholder:text-gray-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button type="submit" className="bg-white text-traveste-700 hover:bg-white/80">
                                    Subscribe
                                </Button>
                            </form>

                            <p className="text-white/80 text-sm mt-4">
                                By subscribing, you agree to our Privacy Policy and consent to receive updates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
