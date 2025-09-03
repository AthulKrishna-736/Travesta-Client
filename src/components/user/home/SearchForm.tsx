import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { showError } from '@/utils/customToast';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
    const [searchTerm, setsearchTerm] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState('1');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const today = new Date();
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (!searchTerm || !checkInDate || !checkOutDate) {
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
            searchTerm,
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-0 border border-[#e7e7e7] rounded-md divide-y md:divide-y-0 md:divide-x"
                >
                    {/* searchTerm */}
                    <div className="lg:col-span-2 flex flex-col justify-start p-3">
                        <span className='text-[#4a4a4a]'>Location or Hotel name</span>
                        <input
                            id="searchTerm"
                            placeholder="Where are you want to stay?"
                            className="text-black font-semibold px-3 pt-4 pb-2 w-full"
                            value={searchTerm}
                            onChange={(e) => setsearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Check-in Date */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] px-2 pt-1 cursor-pointer">
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Check-In</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <input
                            type="text"
                            id="check-in"
                            placeholder="DD-MM-YYYY"
                            value={checkInDate}
                            onFocus={(e) => {
                                e.target.type = "date"
                                e.target.showPicker?.();
                            }}
                            onClick={(e) => {
                                e.currentTarget.type = "date"
                                e.currentTarget.showPicker?.();
                            }}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="w-full pr-10 py-2 text-sm placeholder:font-semibold placeholder:text-black focus:outline-none uppercase"
                        />
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] px-2 pt-1 cursor-pointer">
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Check-Out</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <input
                            type="text"
                            id="check-out"
                            placeholder='DD-MM-YYYY'
                            value={checkOutDate}
                            onFocus={(e) => {
                                e.target.type = "date"
                                e.target.showPicker?.();
                            }}
                            onClick={(e) => {
                                e.currentTarget.type = "date"
                                e.currentTarget.showPicker?.();
                            }}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="w-full pr-10 py-2 text-sm placeholder:font-semibold placeholder:text-black focus:outline-none uppercase"
                        />
                    </div>

                    {/* Guests */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] px-2 pt-1 cursor-pointer">
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Guests & Rooms</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <Select value={guests} onValueChange={setGuests} >
                            <SelectTrigger className="w-full border-none shadow-none outline-none ring-0 focus:ring-0 focus:border-0 focus:outline-none">
                                <SelectValue placeholder="Guests" className='border-none outline-none' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 Guest</SelectItem>
                                <SelectItem value="2">2 Guests</SelectItem>
                                <SelectItem value="3">3 Guests</SelectItem>
                                <SelectItem value="4+">4+ Guests</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </form>
            </CardContent>
            <Button
                type="submit"
                className="w-40 absolute bottom-[-18px] right-0 left-0 mx-auto bg-gradient-to-r from-blue-400 to-blue-700 text-white text-lg rounded-4xl font-bold hover:from-blue-600 hover:to-blue-800 transition uppercase"
            >
                Search
            </Button>
        </Card>
    );
};

export default SearchForm;
