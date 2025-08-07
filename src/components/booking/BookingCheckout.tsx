import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import { useConfirmBooking, useCreateBooking } from '@/hooks/user/useBooking';
import { useCreatePaymentIntent } from '@/hooks/user/useWallet';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm, { PaymentSuccessData } from '@/components/wallet/CheckoutForm';
import { env } from '@/config/config';

const stripePromise = loadStripe(env.STRIPE_SECRET);

const BookingCheckout: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const { mutateAsync: createBooking, isPending } = useCreateBooking();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
    const { mutateAsync: confirmBooking } = useConfirmBooking();


    if (!state) {
        return (
            <div className="text-center mt-16 text-red-600 text-lg">
                No booking data found. Please go back and select a room.
            </div>
        );
    }

    useEffect(() => {
        console.log('state: ', state);
    }, [state]);

    const { hotel, room, formData, totalPrice, days } = state;

    const handleBookingPaymentSuccess = async (data: PaymentSuccessData) => {
        if (data.type === "booking") {
            await confirmBooking({
                receiverId: data.receiverId,
                amount: data.amount,
                transactionId: data.transactionId,
                description: data.description,
                relatedBookingId: data.relatedBookingId,
            });
            navigate('/user/booking')
        }
    };


    const handleConfirm = async () => {
        try {
            const payload = {
                hotelId: hotel._id,
                roomId: room._id,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                guests: formData.guests,
                totalPrice: totalPrice,
            };

            const res = await createBooking(payload);

            if (res?.data) {
                const bookingId = res.data._id;
                const amount = res.data.totalPrice;

                setBookingId(bookingId);

                const paymentRes = await createPaymentIntent(amount);

                if (paymentRes?.data?.clientSecret) {
                    setClientSecret(paymentRes.data.clientSecret);
                }
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
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardContent className="p-6 space-y-4">
                    {/* Hotel Image */}
                    <img
                        src={hotel.images?.[0]}
                        alt={hotel.name}
                        className="w-full h-64 object-cover rounded-xl"
                    />

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
                            <img
                                src={room.images?.[0]}
                                alt={room.name}
                                className="w-32 h-24 object-cover rounded-md"
                            />
                            <div className="flex flex-col gap-1">
                                <Badge variant="secondary">{room.bedType}</Badge>
                                <p className="text-sm font-medium">{room.name}</p>
                                <p className="text-sm text-muted-foreground">{room.description}</p>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Check-In: {formData.checkIn}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Check-Out: {formData.checkOut}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Guests: {formData.guests}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Days: {days}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-semibold mb-2">Price Breakdown</h3>
                            <div className="flex justify-between text-sm">
                                <span>₹{room.basePrice} x {days} nights</span>
                                <span>₹{room.basePrice * days}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium mt-2">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
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
                                        isForBooking
                                        receiverId={hotel.vendorId}
                                        bookingId={bookingId!}
                                    />
                                </Elements>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingCheckout;
