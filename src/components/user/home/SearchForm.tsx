import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CalendarDays, Users, MapPin } from "lucide-react";
import { cn } from '@/lib/utils';
import { showError, showSuccess } from '@/utils/customToast';

const SearchForm = () => {
    const [destination, setDestination] = useState("");
    const [checkInDate, setCheckInDate] = useState<Date>();
    const [checkOutDate, setCheckOutDate] = useState<Date>();
    const [guests, setGuests] = useState("2");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!destination) return showError("Please enter a destination");
        if (!checkInDate || !checkOutDate) return showError("Please select check-in and check-out dates");

        showSuccess(`Searching in ${destination}`);
        console.log('check query here', { destination, checkInDate, checkOutDate, guests });
    };

    return (
        <Card className="mx-auto max-w-5xl w-full -mt-24 z-10 relative shadow-lg bg-white border border-gray-200 animate-slide-in">
            <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Destination */}
                    <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="destination" className="text-sm font-medium">Destination</Label>
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

                    {/* Check-in */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Check-in</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !checkInDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {checkInDate ? checkInDate.toDateString() : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-50" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={setCheckInDate}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Check-out */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Check-out</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !checkOutDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {checkOutDate ? checkOutDate.toDateString() : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-50" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={setCheckOutDate}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Guests & Rooms */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Guests & Rooms</Label>
                        <div className="flex gap-2">
                            <Select value={guests} onValueChange={setGuests}>
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <SelectValue placeholder="Guests" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 Guest</SelectItem>
                                    <SelectItem value="2">2 Guests</SelectItem>
                                    <SelectItem value="3">3 Guests</SelectItem>
                                    <SelectItem value="4">4 Guests</SelectItem>
                                    <SelectItem value="5+">5+ Guests</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <Button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SearchForm;
