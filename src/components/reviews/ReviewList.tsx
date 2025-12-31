import React from 'react'
import RatingDetails from '../hotel/RatingDetails'
import Pagination from '../common/Pagination'
import { IRating } from '@/types/rating.types'

interface IReviewListProps {
    ratings?: IRating[];
    totalPages?: number;
    currentPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const ReviewList: React.FC<IReviewListProps> = ({ ratings, totalPages, currentPage, setPage }) => {
    return (
        <div>
            {ratings && ratings.length > 0 ? (
                <>
                    <RatingDetails ratings={ratings} />
                    {totalPages && totalPages > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            ) : (
                <div className='text-lg font-semibold'>
                    No Ratings Found.
                </div>
            )}
        </div>
    )
}

export default ReviewList;
