import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import { useConfirmBooking } from '@/hooks/user/useBooking';
import { useCreatePaymentIntent } from '@/hooks/user/useWallet';
import { CreditCard, Wallet } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from '@/components/wallet/CheckoutForm';
import { env } from '@/config/config';
import { showError } from '@/utils/customToast';
import { useGetHotelById } from '@/hooks/vendor/useHotel';
import { useGetUserRoomById } from '@/hooks/vendor/useRoom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useDispatch } from 'react-redux';
import { saveLastVisitedPath } from '@/store/slices/navigationSlice';

const stripePromise = loadStripe(env.STRIPE_SECRET);

const BookingCheckout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [params] = useSearchParams();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'wallet' | null>(null);
    const user = useSelector((state: RootState) => state.user.user?.id);

    const hotelId = params.get('hotelId');
    const vendorId = params.get('vendorId');
    const roomId = params.get('roomId');
    const rooms = Number(params.get('rooms')) || 1
    const adults = Number(params.get('adults'));
    const children = Number(params.get('children'));
    const checkIn = params.get('checkIn');
    const checkOut = params.get('checkOut');
    const totalPrice = Number(params.get('totalPrice'));
    const days = Number(params.get('days'));

    const { data: hotelResponse, isLoading: isHotelLoading } = useGetHotelById(hotelId!);
    const { data: roomResponse, isLoading: isRoomLoading } = useGetUserRoomById(roomId!);
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
    const hotel = hotelResponse ? hotelResponse.data : null;
    const room = roomResponse ? roomResponse.data : null; //needs to solve this properly fetch the room and hotel separately get their ids simple

    const { mutateAsync: confirmBooking, isPending } = useConfirmBooking(
        vendorId || 'random',
        paymentMethod || 'wallet',
    );


    if (isHotelLoading || isRoomLoading) {
        return (
            <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-center shadow-sm animate-pulse">
                <h2 className="text-xl font-semibold mb-2">Loading Booking Details...</h2>
                <p className="text-base">Please wait while we fetch hotel and room information.</p>
            </div>
        );
    }

    if (!hotel || !room) {
        return (
            <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-red-50 border border-red-400 text-red-700 rounded-xl text-center shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Hotel or Room Not Found</h2>
                <p className="text-base">
                    We couldn’t find the hotel or room you selected. <br />
                    Please go back and select again.
                </p>
            </div>
        );
    }

    const handleBookingPaymentSuccess = async () => {
        const payload = {
            hotelId: hotel.id,
            roomId: room.id,
            checkIn: checkIn!,
            checkOut: checkOut!,
            guests: Number(adults + children),
            totalPrice: totalPrice,
        };
        await confirmBooking(payload);
        navigate('/user/booking');
    };


    const handleConfirm = async () => {
        try {
            if (!paymentMethod) {
                showError('Select any of the payment method');
                return;
            }

            const payload = {
                hotelId: hotel.id,
                roomId: room.id,
                checkIn: checkIn!,
                checkOut: checkOut!,
                guests: Number(adults + children),
                totalPrice: totalPrice,
            };

            if (paymentMethod === 'wallet') {
                await confirmBooking(payload);
                navigate('/user/booking');
                return;
            }

            if (paymentMethod === 'online') {
                const paymentRes = await createPaymentIntent(totalPrice * 100);
                if (paymentRes?.data?.clientSecret) {
                    setClientSecret(paymentRes.data.clientSecret);
                }
                return;
            }
        } catch (err: any) {
            console.error('Error in booking or payment intent:', err);
        }
    };

    const stripeOptions: StripeElementsOptions = {
        clientSecret: clientSecret ?? '',
        appearance: {
            theme: 'stripe',
        },
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
            <Card>
                <CardContent className="p-6 space-y-4">
                    {/* Hotel Image */}
                    {hotel.images && hotel.images.length > 0 && (
                        <img
                            src={hotel.images?.[0]}
                            alt={hotel.name}
                            className="w-full h-64 object-cover rounded-xl"
                        />
                    )}
                    <div className="space-y-2">
                        {/* Hotel Name & Address */}
                        <div>
                            <h2 className="text-2xl font-bold">{hotel.name}</h2>
                            <p className="text-muted-foreground text-sm flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {hotel.address}
                            </p>
                        </div>

                        {/* Room Image & Name */}
                        <div className="flex gap-4 items-start">
                            {room.images && room.images.length > 0 && (
                                <img
                                    src={room.images?.[0]}
                                    alt={room.name}
                                    className="w-32 h-24 object-cover rounded-md"
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                <Badge className='px-4 py-1 bg-blue-900'>{room.bedType}</Badge>
                                <p className="text-sm font-medium">{room.name}</p>
                                <p className="text-sm font-medium">Type: {room.roomType}</p>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 gap-4  pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Check-In:  {new Date(checkIn!).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Check-Out: {new Date(checkOut!).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Guests: {adults + children}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Days: {days}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-semibold mb-2">Price Breakdown</h3>
                            <div className="flex justify-between">
                                <span>₹{room.basePrice} x {days} nights & {rooms} room(s)</span>
                                <span>₹{room.basePrice * days}</span>
                            </div>
                            <div className="flex justify-between font-medium mt-2">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>


                        {!user ? (
                            <div className="pt-6 flex flex-col items-center gap-3">

                                <p className="text-gray-600 text-center">
                                    Please login to continue with your booking
                                </p>

                                <Button
                                    onClick={() => {
                                        dispatch(saveLastVisitedPath(window.location.pathname + window.location.search));
                                        navigate('/user/login')
                                    }}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg"
                                >
                                    Login to Continue
                                </Button>

                            </div>
                        ) : (
                            <>
                                {/* Payment Method Selection */}
                                <div className="flex flex-col gap-3 pt-4">

                                    <label className={`w-full flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            className="hidden"
                                            checked={paymentMethod === 'online'}
                                            onChange={() => setPaymentMethod('online')}
                                        />
                                        <CreditCard className="w-6 h-6" />
                                        <span>Online Payment</span>
                                    </label>

                                    <label className={`w-full flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="wallet"
                                            className="hidden"
                                            checked={paymentMethod === 'wallet'}
                                            onChange={() => setPaymentMethod('wallet')}
                                        />
                                        <Wallet className="w-6 h-6" />
                                        <span>Wallet</span>
                                    </label>

                                </div>

                                {/* Confirm Button */}
                                <div className="pt-6">
                                    {!clientSecret ? (
                                        <Button onClick={handleConfirm} disabled={isPending}>
                                            {isPending ? 'Booking...' : 'Confirm Booking'}
                                        </Button>
                                    ) : (
                                        <Elements stripe={stripePromise} options={stripeOptions}>
                                            <CheckoutForm
                                                open={!!clientSecret}
                                                onClose={() => setClientSecret(null)}
                                                onPaymentSuccess={handleBookingPaymentSuccess}
                                            />
                                        </Elements>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div >
    );
};

export default BookingCheckout;
