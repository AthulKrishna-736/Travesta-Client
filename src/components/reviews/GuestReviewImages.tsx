import React from 'react'

interface IGuestReviewImagesProps {
    images: string[];
}

const GuestReviewImages: React.FC<IGuestReviewImagesProps> = ({ images }) => {
    return (
        <div className='flex gap-2 justify-center items-center flex-wrap w-full'>
            {images && images.length > 0 ? images.slice(0, 4).map((r, idx) => (
                <img
                    className='w-65 h-40 rounded-md shadow-md'
                    key={idx}
                    src={r}
                    alt="ratingImages"
                />
            )) : (
                <div className='text-lg'>
                    No Guest Images Found
                </div>
            )}
        </div>
    )
}

export default GuestReviewImages;