import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, MapPin } from "lucide-react";
import { showError } from '@/utils/customToast';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
    const [destination, setDestination] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState('1');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const today = new Date();
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (!destination || !checkInDate || !checkOutDate) {
            showError("Please fill in all fields");
            return;
        }

        if (checkIn < today) {
            showError("Check-in date cannot be in the past");
            return;
        }

        if (checkOut <= checkIn) {
            showError("Check-out date must be after check-in date");
            return;
        }

        const params = new URLSearchParams({
            destination,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
        });

        navigate(`/user/hotels?${params.toString()}`);
    };

    return (
        <Card className="mx-auto max-w-5xl w-full -mt-24 z-10 relative shadow-lg border border-gray-200 bg-white animate-slide-in">
            <CardContent className="p-6 md:p-8">
                <form
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
                >
                    {/* Destination */}
                    <div className="lg:col-span-2 space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                id="destination"
                                placeholder="Where are you going?"
                                className="pl-10"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Check-in Date */}
                    <div className="space-y-2">
                        <Label htmlFor="check-in">Check-in</Label>
                        <Input
                            type="date"
                            id="check-in"
                            value={checkInDate}
                            onClick={(e) => {
                                const input = e.currentTarget;
                                input.showPicker?.();
                            }}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-2">
                        <Label htmlFor="check-out">Check-out</Label>
                        <Input
                            type="date"
                            id="check-out"
                            value={checkOutDate}
                            onClick={(e) => {
                                const input = e.currentTarget;
                                input.showPicker?.();
                            }}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                        <Label>Guests & Rooms</Label>
                        <Select value={guests} onValueChange={setGuests}>
                            <SelectTrigger className="w-full">
                                <Users className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Guests" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 Guest</SelectItem>
                                <SelectItem value="2">2 Guests</SelectItem>
                                <SelectItem value="3">3 Guests</SelectItem>
                                <SelectItem value="4+">4+ Guests</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-center lg:my-5.5">
                        <Button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-lg"
                        >
                            <Search className='w-4 h-4 m-0 p-0' />
                            Search
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SearchForm;
