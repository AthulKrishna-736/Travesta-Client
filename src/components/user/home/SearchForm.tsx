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
    const [rooms, setRooms] = useState("1");


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!destination) {
            showError("Please enter a destination");
            return;
        }

        if (!checkInDate || !checkOutDate) {
            showError("Please select check-in and check-out dates");
            return;
        }

        showSuccess(`Looking for stays in ${destination}`);

        console.log("Search params:", { destination, checkInDate, checkOutDate, guests, rooms });
    };

    return (
        <Card className="mx-auto max-w-5xl -mt-24 z-10 relative shadow-lg animate-slide-in">
            <CardContent className="p-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Destination */}
                    <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="destination" className="text-sm font-medium">
                            Destination
                        </Label>
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
                                    {/* {checkInDate ? format(checkInDate, "PP") : "Select date"} */}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={setCheckInDate}
                                    initialFocus
                                    // disabled={(date) => date < new Date()}
                                    className="p-3 pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Check-out Date */}
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
                                    {/* {checkOutDate ? format(checkOutDate, "PP") : "Select date"} */}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={setCheckOutDate}
                                    initialFocus
                                    // disabled={(date) => (checkInDate ? date < new Date() || date < checkInDate : date < new Date())}

                                    className="p-3 pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Guests & Room Selector and Submit Button */}
                    <div className="space-y-4 lg:col-span-1">
                        {/* Guests & Rooms */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Guests & Rooms</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Select value={guests} onValueChange={setGuests}>
                                    <SelectTrigger>
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

                                <Select value={rooms} onValueChange={setRooms}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rooms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Room</SelectItem>
                                        <SelectItem value="2">2 Rooms</SelectItem>
                                        <SelectItem value="3">3 Rooms</SelectItem>
                                        <SelectItem value="4+">4+ Rooms</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full bg-traveste-500 hover:bg-traveste-600">
                            <Search className="mr-2 h-4 w-4" /> Search Hotels
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SearchForm;
