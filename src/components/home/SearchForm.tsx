import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, MapPinIcon, Minus, Plus } from "lucide-react";
import { showError } from '@/utils/customToast';
import { useNavigate } from 'react-router-dom';
import { PRICE_RANGES } from '@/constants/constants';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';
import { disablePastDates, useDebounce } from '@/utils/helperFunctions';
import { env } from '@/config/config';

type TState = {
    search: string,
    lat: number | null,
    long: number | null,
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    rooms: number;
    priceRange: [number, number];
}

type TAction = { type: 'SET_FIELD'; field: keyof TState; value: TState[keyof TState] } | { type: 'RESET' };

const initialState: TState = {
    search: '',
    lat: null,
    long: null,
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
    const [geoSearch, setGeoSearch] = useState('');
    const debouncedSearch = useDebounce(geoSearch, 1500);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const checkInRef = useRef<HTMLInputElement | null>(null);
    const checkOutRef = useRef<HTMLInputElement | null>(null);
    const [showRoomGuestModal, setShowRoomGuestModal] = useState<boolean>(false);
    const priceRangeRef = useRef<HTMLSelectElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const response = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(debouncedSearch)}&language=en&api_key=${env.OLA_API_SECRET}`);
                const data = await response.json();
                setSuggestions(data.predictions);
            } catch (err) {
                console.error("Location autocomplete failed:", err);
            }
        };

        fetchSuggestions();
    }, [debouncedSearch]);


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


    const handleGeoLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGeoSearch(e.target.value);
        setShowSuggestions(true);
    };

    const handleSelectSuggestion = (item: any) => {
        const mainText = item.structured_formatting?.main_text || "";
        const lat = item.geometry.location.lat || null;
        const lng = item.geometry.location.lng || null;

        dispatch({ type: "SET_FIELD", field: "search", value: mainText });
        dispatch({ type: "SET_FIELD", field: "lat", value: lat });
        dispatch({ type: "SET_FIELD", field: "long", value: lng });

        setGeoSearch(mainText);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const MAX_GUESTS_PER_ROOM = 2;
        const totalGuests = state.adults + state.children;
        const maxAllowedGuests = state.rooms * MAX_GUESTS_PER_ROOM;
        const checkIn = new Date(state.checkInDate);
        const checkOut = new Date(state.checkOutDate);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);


        if (!state.checkInDate) {
            showError('Please select check-in date')
            return;
        }

        if (!state.checkOutDate) {
            showError('Please select check-out date');
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

        let finalLat = state.lat;
        let finalLng = state.long;

        if (finalLat == null || finalLng == null) {
            if (!navigator.geolocation) {
                showError("Your browser does not support location access.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    finalLat = pos.coords.latitude;
                    finalLng = pos.coords.longitude;

                    continueSearch(finalLat, finalLng);
                },
                () => {
                    showError("Location access denied. Please enable it or select a place manually.");
                }
            );

            return;
        }

        continueSearch(finalLat, finalLng);
    };

    const continueSearch = (lat: number, lng: number) => {
        const params = new URLSearchParams({
            searchTerm: state.search || "My Location",
            lat: lat.toString(),
            long: lng.toString(),
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
        <Card className="w-[95%] xl:max-w-6xl relative shadow-lg border border-gray-200 bg-white rounded-sm">
            <CardContent className='px-4 py-5'>
                <form
                    id="searchForm"
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-0 border border-[#e7e7e7] rounded-sm divide-y md:divide-y-0 md:divide-x"
                >
                    {/* searchTerm */}
                    <div className="lg:col-span-2 relative flex flex-col justify-start pt-1 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out">
                        <span className="text-[#4a4a4a] text-start pl-3 font-medium">
                            Location or Hotel name
                        </span>

                        <input
                            id="searchTerm"
                            placeholder="Where you want to stay?"
                            className="text-black text-lg font-semibold placeholder:font-normal px-3 pt-4 pb-2 w-full focus:outline-none"
                            value={geoSearch}
                            onChange={handleGeoLocationSearch}
                            onFocus={() => setShowSuggestions(true)}
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md rounded-b-sm z-20 max-h-54 overflow-y-auto">

                                {suggestions.map((item: any, idx) => (
                                    <div
                                        key={idx}
                                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-[#333]"
                                        onClick={() => handleSelectSuggestion(item)}
                                    >
                                        <div className='flex gap-0.5 justify-start items-center text-sm font-semibold cursor-pointer py-0.5'>
                                            <MapPinIcon className='h-4 w-4 text-blue-500' />
                                            {item.structured_formatting.main_text}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>

                    {/* Check-in Date */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out px-2 pt-1 cursor-pointer"
                        onClick={() => checkInRef.current?.focus()}
                    >
                        <div className='flex'>
                            <span className='text-[#4a4a4a] font-medium'>Check-In</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <input
                            type="date"
                            ref={checkInRef}
                            value={state.checkInDate}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                            min={disablePastDates(new Date())}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'checkInDate', value: e.target.value })}
                            className="w-full py-2 text-md font-bold placeholder:font-semibold placeholder:text-[#ffffff] focus:outline-none uppercase cursor-pointer"
                        />
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-2 hover:bg-[#eaf5ff] transition-colors duration-300 ease-in-out px-2 pt-1 cursor-pointer"
                        onClick={() => checkOutRef.current?.focus()}
                    >
                        <div className='flex'>
                            <span className='text-[#4a4a4a] font-medium'>Check-Out</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <input
                            type="date"
                            ref={checkOutRef}
                            value={state.checkOutDate}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                            min={disablePastDates(state.checkInDate || new Date(), 1)}
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
                            <span className='text-[#4a4a4a] font-medium'>Rooms & Guests</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <div className="space-x-0.5">
                            <span className='font-bold text-2xl'>{state.rooms}</span>
                            <span className='font-medium'>Room{state.rooms > 1 ? "s" : ""}</span>
                            <span className='font-bold text-2xl'>{state.adults + state.children}</span>
                            <span className='font-medium'>Guest{state.adults + state.children > 1 ? "s" : ""}</span>
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
                            <span className='text-[#4a4a4a] font-medium'>Price Range</span>
                            <ChevronDown className='text-[#008cff] h-4 w-4 mt-1.5 ml-1' />
                        </div>
                        <select
                            value={JSON.stringify(state.priceRange)}
                            ref={priceRangeRef}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'priceRange', value: JSON.parse(e.target.value) })}
                            className='w-full outline-none shadow-none border-none appearance-none cursor-pointer font-bold text-lg'
                        >
                            {PRICE_RANGES.slice(0, 4).map((i) => {
                                return (
                                    <option
                                        key={i.label}
                                        value={JSON.stringify(i.range)}
                                        className="font-medium"
                                    >
                                        {i.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </form>
                <div className="absolute -bottom-3 w-full flex justify-center">
                    <Button
                        type="submit"
                        form="searchForm"
                        className="w-40 bg-gradient-to-r from-[#53b2fe] to-[#065af3] text-white text-lg rounded-4xl font-bold hover:from-blue-600 hover:to-blue-800 transition uppercase cursor-pointer"
                    >
                        Search
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
};

export default SearchForm;
