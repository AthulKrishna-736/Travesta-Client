import { PaginationProps } from '@/types/component.types'
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
            <Button variant='outline' size='sm' onClick={handlePrev} disabled={currentPage == 1}>
                <ChevronLeft className='h-4 w-4' />
            </Button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <Button variant='outline' size='sm' onClick={handleNext} disabled={currentPage == totalPages}>
                <ChevronRight className='h-4 w-4'/>
            </Button>
        </div>
    )
}

export default Pagination;