import React, { useReducer, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { showError } from '@/utils/customToast';
import { useNavigate } from 'react-router-dom';
import { PRICE_RANGES } from '@/components/sidebar/UserFilterSidebar';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';

type TState = {
    searchTerm: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    rooms: number;
    priceRange: [number, number];
}

type TAction = { type: 'SET_FIELD'; field: keyof TState; value: TState[keyof TState] } | { type: 'RESET' };

const initialState: TState = {
    searchTerm: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    rooms: 1,
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
    const [showRoomGuestModal, setShowRoomGuestModal] = useState<boolean>(false);
    const priceRangeRef = useRef<HTMLSelectElement | null>(null);
    const navigate = useNavigate();

    const handleAddButton = (field: 'rooms' | 'adults' | 'children', e: React.MouseEvent) => {
        e.preventDefault();
        dispatch({
            type: 'SET_FIELD',
            field,
            value: (state[field] as number) + 1,
        });
    };

    const handleSubtractButton = (field: 'rooms' | 'adults' | 'children', e: React.MouseEvent) => {
        e.preventDefault();
        dispatch({
            type: 'SET_FIELD',
            field,
            value: Math.max(0, (state[field] as number) - 1),
        });
    };


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const MAX_GUESTS_PER_ROOM = 4;
        const totalGuests = state.adults + state.children;
        const maxAllowedGuests = state.rooms * MAX_GUESTS_PER_ROOM;
        const now = new Date();
        const checkIn = new Date(state.checkInDate);
        checkIn.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
        const checkOut = new Date(state.checkOutDate);
        checkOut.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
        now.setHours(0, 0, 0, 0);

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

        if (checkIn < now) {
            showError("Check-in date cannot be in the past");
            return;
        }

        if (checkOut <= checkIn) {
            showError("Check-out date must be after check-in date");
            return;
        }

        if (state.rooms <= 0) {
            showError("You must have at least one room.");
            return;
        }

        if (state.adults <= 0) {
            showError("There must be at least one adult.");
            return;
        }

        if (totalGuests > maxAllowedGuests) {
            showError(`A maximum of ${MAX_GUESTS_PER_ROOM} guests are allowed per room. Please add more rooms or reduce guests.`);
            return;
        }

        if (totalGuests === 0) {
            showError("Please select at least one guest.");
            return;
        }

        const params = new URLSearchParams({
            searchTerm: state.searchTerm,
            checkIn: state.checkInDate,
            checkOut: state.checkOutDate,
            adults: state.adults.toString(),
            children: state.children.toString(),
            rooms: state.rooms.toString(),
            minPrice: String(state.priceRange[0]),
            maxPrice: String(state.priceRange[1]),
        });

        navigate(`/user/hotels?${params.toString()}`);
    };

    return (
        <Card className="mx-auto max-w-5xl w-full -mt-24 z-10 relative shadow-lg border border-gray-200 bg-white rounded-sm">
            <CardContent className="p-6 md:p-8 lg:pb-10">
                <form
                    id="searchForm"
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-0 border border-[#e7e7e7] rounded-sm divide-y md:divide-y-0 md:divide-x"
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

                    {/* Guests & Rooms */}
                    <div
                        className="relative space-y-2 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out px-2 pt-1 cursor-pointer"
                        onClick={() => setShowRoomGuestModal(true)}
                    >
                        <div className='flex'>
                            <span className='text-[#4a4a4a]'>Rooms & Guests</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <div className="font-semibold py-1">
                            {state.rooms} Room{state.rooms > 1 ? "s" : ""},{" "}
                            {state.adults + state.children} Guest{state.adults + state.children > 1 ? "s" : ""}
                        </div>

                        <Dialog open={showRoomGuestModal} onOpenChange={setShowRoomGuestModal}>
                            <DialogContent>
                                <div className={`absolute bottom-[-115px] right-0 bg-white w-[350px] h-[150px] z-10 shadow-2xl rounded-sm p-4 border-1 border-[#d8d8d8] hover:border-[#53b2fe]`}>
                                    <div className='flex w-full justify-between items-center'>
                                        <h1 className='text-sm font-semibold text-[#4a4a4a]'>Room</h1>
                                        <div className='flex my-0.5 px-1 border-[#d8d8d8] border-1 rounded-sm gap-1 justify-center items-center'>
                                            <button className='cursor-pointer' onClick={(e) => handleSubtractButton('rooms', e)}><Minus className='text-gray-500 w-4 h-4' /></button>
                                            <h3 className='font-semibold w-[20px]'>{state.rooms}</h3>
                                            <button className='cursor-pointer' onClick={(e) => handleAddButton('rooms', e)}><Plus className='text-gray-500 w-4 h-4' /></button>
                                        </div>
                                    </div>
                                    <div className='flex w-full justify-between items-center'>
                                        <h1 className='text-sm font-semibold text-[#4a4a4a]'>Adults</h1>
                                        <div className='flex my-0.5 px-1 border-[#d8d8d8] border-1 rounded-sm gap-1 justify-center items-center'>
                                            <button className='cursor-pointer' onClick={(e) => handleSubtractButton('adults', e)}><Minus className='text-gray-500 w-4 h-4' /></button>
                                            <h3 className='font-semibold w-[20px]'>{state.adults}</h3>
                                            <button className='cursor-pointer' onClick={(e) => handleAddButton('adults', e)}><Plus className='text-gray-500 w-4 h-4' /></button>
                                        </div>
                                    </div>

                                    <div className='flex w-full justify-between items-center'>
                                        <div className="text-left">
                                            <h1 className="text-sm font-semibold text-[#4a4a4a] m-0 p-0 leading-tight">Children</h1>
                                            <h6 className="text-xs text-[#4a4a4a] m-0 p-0 leading-none">0 - 17 Years Old</h6>
                                        </div>

                                        <div className='flex my-0.5 px-1 border-[#d8d8d8] border-1 rounded-sm gap-1 justify-center items-center'>
                                            <button className='cursor-pointer' onClick={(e) => handleSubtractButton('children', e)}><Minus className='text-gray-500 w-4 h-4' /></button>
                                            <h3 className='font-semibold w-[20px]'>{state.children}</h3>
                                            <button className='cursor-pointer' onClick={(e) => handleAddButton('children', e)}><Plus className='text-gray-500 w-4 h-4' /></button>
                                        </div>
                                    </div>
                                    <div className='text-[11px] text-left text-[#4a4a4a] my-1'>
                                        Please provide right number of children for best options and prices.
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
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
                className="w-40 absolute bottom-[-18px] right-0 left-0 mx-auto bg-gradient-to-r from-[#53b2fe] to-[#065af3] text-white text-lg rounded-4xl font-bold hover:from-blue-600 hover:to-blue-800 transition uppercase cursor-pointer"
            >
                Search
            </Button>
        </Card>
    );
};

export default SearchForm;
