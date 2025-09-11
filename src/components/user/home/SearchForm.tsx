import React, { useReducer, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { showError } from '@/utils/customToast';
import { useNavigate } from 'react-router-dom';
import { PRICE_RANGES } from '@/components/sidebar/UserFilterSidebar';

type TState = {
    searchTerm: string;
    checkInDate: string;
    checkOutDate: string;
    guests: string;
    priceRange: [number, number];
}

type TAction = { type: 'SET_FIELD'; field: keyof TState; value: any } | { type: 'RESET' };

const initialState: TState = {
    searchTerm: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '1',
    priceRange: [0, 1500],
}

const reducer = (state: TState, action: TAction): TState => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

const SearchForm = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const checkInRef = useRef<HTMLInputElement | null>(null);
    const checkOutRef = useRef<HTMLInputElement | null>(null);
    const guestRef = useRef<HTMLSelectElement | null>(null);
    const priceRangeRef = useRef<HTMLSelectElement | null>(null);

    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkIn = new Date(state.checkInDate);
        checkIn.setHours(0, 0, 0, 0);
        const checkOut = new Date(state.checkOutDate);
        checkOut.setHours(0, 0, 0, 0);

        if (!state.searchTerm) {
            showError('Please enter property name or location');
            return;
        }

        if (!state.checkInDate) {
            showError('Please select check-in date')
            return;
        }

        if (!state.checkOutDate) {
            showError('Please select check-out date');
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
            searchTerm: state.searchTerm,
            checkIn: state.checkInDate,
            checkOut: state.checkOutDate,
            guests: state.guests,
            minPrice: String(state.priceRange[0]),
            maxPrice: String(state.priceRange[1]),
        });

        navigate(`/user/hotels?${params.toString()}`);
    };

    return (
        <Card className="mx-auto max-w-5xl w-full -mt-24 z-10 relative shadow-lg border border-gray-200 bg-white animate-slide-in">
            <CardContent className="p-6 md:p-8 lg:pb-10">
                <form
                    id="searchForm"
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-0 border border-[#e7e7e7] rounded-md divide-y md:divide-y-0 md:divide-x"
                >
                    {/* searchTerm */}
                    <div className="lg:col-span-2 flex flex-col justify-start pt-1 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out">
                        <span className="text-[#4a4a4a] text-start pl-3">Location or Hotel name</span>
                        <input
                            id="searchTerm"
                            placeholder="Where you want to stay?"
                            className="text-black text-lg font-semibold placeholder:font-normal px-3 pt-4 pb-2 w-full focus:outline-none"
                            value={state.searchTerm}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'searchTerm', value: e.target.value })}
                        />
                    </div>

                    {/* Check-in Date */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out px-2 pt-1 cursor-pointer"
                        onClick={() => checkInRef.current?.focus()}
                    >
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Check-In</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <input
                            type="date"
                            ref={checkInRef}
                            value={state.checkInDate}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                            min={new Date().toLocaleDateString('en-CA')}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'checkInDate', value: e.target.value })}
                            className="w-full py-2 text-md font-bold placeholder:font-semibold placeholder:text-[#ffffff] focus:outline-none uppercase cursor-pointer"
                        />
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out px-2 pt-1 cursor-pointer"
                        onClick={() => checkOutRef.current?.focus()}
                    >
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Check-Out</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <input
                            type="date"
                            ref={checkOutRef}
                            value={state.checkOutDate}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                            min={state.checkInDate ? new Date(new Date(state.checkInDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-CA") : new Date().toLocaleDateString('en-CA')}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'checkOutDate', value: e.target.value })}
                            className="w-full py-2 text-md font-bold placeholder:font-semibold placeholder:text-gray-500 focus:outline-none uppercase cursor-pointer"
                        />
                    </div>

                    {/* Guests */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out px-2 pt-1 cursor-pointer"
                        onClick={() => guestRef.current?.focus()}
                    >
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Guests</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <select
                            value={state.guests}
                            ref={guestRef}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'guests', value: e.target.value })}
                            className='w-full p-2 outline-none shadow-none border-none appearance-none cursor-pointer font-semibold'
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                        </select>
                    </div>

                    {/* Price range */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out px-2 pt-1 cursor-pointer"
                        onClick={() => priceRangeRef.current?.focus()}
                    >
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Price Range</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <select
                            value={JSON.stringify(state.priceRange)}
                            ref={priceRangeRef}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'priceRange', value: JSON.parse(e.target.value) })}
                            className='w-full outline-none shadow-none border-none p-2 appearance-none cursor-pointer font-semibold'
                        >
                            {PRICE_RANGES.map((i) => {
                                return (
                                    <option
                                        key={i.label}
                                        value={JSON.stringify(i.range)}
                                        className="font-normal"
                                    >
                                        {i.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </form>
            </CardContent>
            <Button
                type="submit"
                form='searchForm'
                className="w-40 absolute bottom-[-18px] right-0 left-0 mx-auto bg-gradient-to-r from-blue-400 to-blue-700 text-white text-lg rounded-4xl font-bold hover:from-blue-600 hover:to-blue-800 transition uppercase cursor-pointer"
            >
                Search
            </Button>
        </Card>
    );
};

export default SearchForm;
