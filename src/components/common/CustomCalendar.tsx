import { useGetCustomDate } from '@/hooks/user/useBooking';
import { Loader2 } from 'lucide-react';
import React from 'react'

export type TCustomCalendarItem = {
    selectedDate: boolean;
    checkIn: Date | string;
    checkOut: Date | string;
    price: number;
}

interface ICustomCalendarProps {
    roomId: string;
    checkIn: string;
    checkOut: string;
}

const CustomCalendar: React.FC<ICustomCalendarProps> = ({ roomId, checkIn, checkOut }) => {
    const DATE_LIMIT = 6;
    const { data: items, isLoading } = useGetCustomDate(roomId, checkIn, checkOut, DATE_LIMIT);

    const handleCustomDate = (customDate: TCustomCalendarItem) => {
        console.log('custom date function call', customDate)
    }

    return (
        <div>
            <h1 className='font-bold text-xl'>Are you flexible with travel dates?</h1>
            <p className='text-[#4a4a4a] mb-6'>Find Alternate Prices with Flexi Dates</p>
            <div className='flex gap-2'>
                {isLoading ? (
                    <div className='flex items-center justify-center gap-2 text-xl text-[#4a4a4a] font-semibold'>
                        <Loader2 className='h-8 w-8 animate-spin' />
                        Loading....
                    </div>
                ) : items ? (
                    items.map((i, idx) => {
                        const WEEK = new Date().toLocaleString('en-US', { weekday: 'short' });
                        const DAY = new Date().getDay();
                        const MONTH = new Date().toLocaleString('en-US', { month: 'short' });
                        return (
                            <div
                                key={idx}
                                className={`relative px-2 py-2 rounded-sm inline-block border ${i.selectedDate ? 'border-[#008cff]' : 'border-[#d8d8d8]'} hover:border-[#008cff] hover:shadow-sm space-y-1.5 cursor-pointer`}
                                onClick={() => handleCustomDate(i)}
                            >
                                {i.selectedDate && (<h1 className='absolute top-[-16px] w-full left-0 px-4 py-0.5 rounded-t-md text-xs font-semibold bg-[#008cff] outline outline-[#008cff] text-white'>Selected Date</h1>)}
                                <h3 className={`${i.selectedDate ? 'font-semibold text-[#008cff]' : ''} text-[15px]`}>{`${WEEK}, ${DAY} ${MONTH} - ${WEEK}, ${DAY} ${MONTH}`}</h3>
                                <h1 className='font-bold text-xl'>₹ {i.price}</h1>
                            </div>
                        )
                    })) : (
                    <div className='text-xl font-semibold'>
                        No Alternative Dates Found
                    </div>
                )}
            </div>
        </div >
    )
}

export default CustomCalendar;