import React, { useState } from 'react';
import { Star, User } from 'lucide-react';
import { TRatingResponse } from '@/types/rating.types';

interface RatingDetailsProps {
    ratings: TRatingResponse[];
}

const RatingDetails: React.FC<RatingDetailsProps> = ({ ratings }) => {

    const calculateAverages = () => {
        if (!ratings || ratings.length === 0) {
            return {
                overall: 0,
                hospitality: 0,
                cleanliness: 0,
                facilities: 0,
                room: 0,
                moneyValue: 0,
            };
        }

        const totals = ratings.reduce(
            (acc, rating) => ({
                hospitality: acc.hospitality + rating.hospitality,
                cleanliness: acc.cleanliness + rating.cleanliness,
                facilities: acc.facilities + rating.facilities,
                room: acc.room + rating.room,
                moneyValue: acc.moneyValue + rating.moneyValue,
            }),
            { hospitality: 0, cleanliness: 0, facilities: 0, room: 0, moneyValue: 0 }
        );

        const count = ratings.length;
        const averages = {
            hospitality: totals.hospitality / count,
            cleanliness: totals.cleanliness / count,
            facilities: totals.facilities / count,
            room: totals.room / count,
            moneyValue: totals.moneyValue / count,
        };

        const overall = (averages.hospitality + averages.cleanliness + averages.facilities + averages.room + averages.moneyValue) / 5;
        return { overall, ...averages };
    };

    const averages = calculateAverages();

    const getRatingLabel = (rating: number) => {
        if (rating >= 4.5) return 'Excellent';
        if (rating >= 4.0) return 'Very Good';
        if (rating >= 3.5) return 'Good';
        if (rating >= 3.0) return 'Average';
        return 'Below Average';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const overallMetrics: { label: string; value: number }[] = [
        { label: "Hospitality", value: averages.hospitality },
        { label: "Cleanliness", value: averages.cleanliness },
        { label: "Facilities", value: averages.facilities },
        { label: "Room", value: averages.room },
        { label: "Value for Money", value: averages.moneyValue },
    ];


    if (!ratings || ratings.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <h2 className="text-2xl font-semibold">Guest Reviews</h2>

            {/* Overall Rating Card */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                {/* Overall Score */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-20 h-20 bg-[#0d92ff] text-white rounded-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{averages.overall.toFixed(1)}</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-lg font-semibold">{getRatingLabel(averages.overall)}</div>
                        <div className="text-sm text-gray-600">
                            Based on {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
                        </div>
                    </div>
                </div>

                {/* Always Visible Rating Breakdown */}
                <div className="space-y-3 text-sm border-t pt-4">
                    {overallMetrics.map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center">
                            <span className="text-gray-700">{label}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0d92ff]"
                                        style={{ width: `${(value / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="font-medium w-8">{value.toFixed(1)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
                {ratings.map((rating) => {
                    const userAvg =
                        (rating.hospitality +
                            rating.cleanliness +
                            rating.facilities +
                            rating.room +
                            rating.moneyValue) /
                        5;

                    const [hovered, setHovered] = useState<string | null>(null);

                    return (
                        <div key={rating.id} className="border border-gray-200 rounded-lg p-4 relative">
                            {/* User Info */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                        {rating.userId.profileImage ? (
                                            <img
                                                src={rating.userId.profileImage}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {rating.userId.firstName} {rating.userId.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(rating.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* User Avg (Hover Tooltip) */}
                                <div
                                    className="relative flex items-center gap-1 bg-[#0d92ff] text-white px-2 py-1 rounded text-sm font-medium cursor-pointer"
                                    onMouseEnter={() => setHovered(rating.id)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    {userAvg.toFixed(1)} <Star className="w-3 h-3 fill-current" />

                                    {hovered === rating.id && (
                                        <div className="absolute top-8 right-0 z-20 bg-white border shadow-lg rounded-lg p-4 w-70 text-xs">
                                            <h3 className="font-semibold mb-3 text-sm text-black">User Rating Breakdown</h3>

                                            {overallMetrics.map(({ label, value }) => (
                                                <div
                                                    key={label}
                                                    className="flex justify-between items-center mb-2"
                                                >
                                                    <span className="text-gray-600">{label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#0d92ff]"
                                                                style={{
                                                                    width: `${(value / 5) * 100}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="font-medium w-8 text-black">
                                                            {value.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-700 text-sm mb-3">{rating.review}</p>
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default RatingDetails;