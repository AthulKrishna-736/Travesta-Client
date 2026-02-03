import { PaginationProps } from '@/types/custom.types'
import React from 'react'
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrev = () => {
        if (currentPage > 1) return onPageChange(currentPage - 1);
    }

    const handleNext = () => {
        if (currentPage < totalPages) return onPageChange(currentPage + 1);
    }
    return (
        <div className='flex items-center justify-center gap-4 py-4'>
            <Button
                variant='ghost'
                className='h-8 w-8 rounded-full border border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                size='sm'
                onClick={handlePrev}
                disabled={currentPage == 1}>
                <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant='ghost'
                className="h-8 w-8 rounded-full border border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                size='sm'
                onClick={handleNext}
                disabled={currentPage == totalPages}>
                <ChevronRight className='h-4 w-4' />
            </Button>
        </div>
    )
}

export default Pagination;