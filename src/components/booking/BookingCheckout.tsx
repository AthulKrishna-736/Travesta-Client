import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Clock, CreditCard, Wallet } from 'lucide-react';
import { useConfirmBooking } from '@/hooks/user/useBooking';
import { useCreatePaymentIntent, useGetWallet } from '@/hooks/user/useWallet';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from '@/components/wallet/CheckoutForm';
import { env } from '@/config/config';
import { showError } from '@/utils/customToast';
import { useGetRoomBySlug } from '@/hooks/vendor/useRoom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { saveLastVisitedPath } from '@/store/slices/navigationSlice';
import { useUserCoupons } from '@/hooks/vendor/useCoupon';
import { ICoupon } from '@/types/coupon.types';
import { useGetHotelBySlug } from '@/hooks/vendor/useHotel';

const stripePromise = loadStripe(env.STRIPE_SECRET);

const BookingCheckout: React.FC = () => {
    const { hotelSlug, roomSlug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [params] = useSearchParams();

    const rooms = Number(params.get('rooms')) || 1;
    const adults = Number(params.get('adults'));
    const children = Number(params.get('children'));
    const checkIn = params.get('checkIn');
    const checkOut = params.get('checkOut');
    const totalPrice = Number(params.get('totalPrice'));
    const days = Number(params.get('days'));

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'wallet' | null>(null);
    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
    const [discountedPrice, setDiscountedPrice] = useState<number>(totalPrice);

    const user = useSelector((state: RootState) => state.user.user?.id);
    const isAuthenticated = Boolean(useSelector((state: RootState) => state.user.user?.id));

    //get hotel details
    const { data: hotelResponse, isLoading: isHotelLoading } = useGetHotelBySlug(hotelSlug!);
    const hotel = hotelResponse ? hotelResponse.data : null;

    //get room details
    const { data: roomResponse, isLoading: isRoomLoading } = useGetRoomBySlug(hotelSlug!, roomSlug!, true);
    const room = roomResponse ? roomResponse.data : null;

    //get wallet details
    const { data: walletResponse } = useGetWallet(isAuthenticated);
    const wallet = walletResponse ? walletResponse.data : null;

    //get coupons for user
    const { data: couponResponse } = useUserCoupons(hotel?.vendorId!, room?.basePrice ?? 0, isAuthenticated && !!hotel?.vendorId && !!room?.basePrice);
    const coupons = couponResponse ? couponResponse.data : [];

    //mutation functions
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
    const { mutateAsync: confirmBooking, isPending } = useConfirmBooking(paymentMethod || 'wallet');

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);

    const checkInTime = hotel?.propertyRules?.checkInTime || "13:00";
    const checkOutTime = hotel?.propertyRules?.checkOutTime || "12:00";

    const [checkInHours, checkInMinutes] = checkInTime.split(":").map(Number);
    const [checkOutHours, checkOutMinutes] = checkOutTime.split(":").map(Number);

    checkInDate.setHours(checkInHours, checkInMinutes, 0, 0);
    checkOutDate.setHours(checkOutHours, checkOutMinutes, 0, 0);

    const applyCoupon = (coupon: ICoupon | null) => {
        if (!coupon) {
            setSelectedCoupon(null);
            setDiscountedPrice(totalPrice);
            return;
        }

        let discount = 0;

        if (coupon.type === 'flat') {
            discount = coupon.value;
        } else if (coupon.type === 'percent') {
            discount = (coupon.value / 100) * totalPrice;
        }

        if (discount > coupon.maxPrice) {
            discount = coupon.maxPrice;
        }

        setSelectedCoupon(coupon);
        setDiscountedPrice(Math.max(totalPrice - discount, 0));
    };

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
                <p className="text-base">Please go back and select again.</p>
            </div>
        );
    }

    const finalizeBooking = async () => {
        const payload = {
            vendorId: hotel.vendorId,
            hotelId: hotel.id,
            roomId: room.id,
            checkIn: checkInDate.toISOString(),
            checkOut: checkOutDate.toISOString(),
            guests: Number(adults + children),
            roomsCount: rooms,
            totalPrice: discountedPrice,
            couponId: selectedCoupon?.id || null,
        };

        await confirmBooking(payload);
        navigate('/user/booking');
    };

    const handleConfirm = async () => {
        try {
            if (!paymentMethod) {
                showError('Select any of the payment methods');
                return;
            }

            const payload = {
                vendorId: hotel.vendorId,
                hotelId: hotel.id,
                roomId: room.id,
                checkIn: checkInDate.toISOString(),
                checkOut: checkOutDate.toISOString(),
                guests: Number(adults + children),
                roomsCount: rooms,
                totalPrice: discountedPrice,
                couponId: selectedCoupon?.id || null,
            };

            if (paymentMethod === 'wallet') {
                await confirmBooking(payload);
                navigate('/user/booking');
                return;
            }

            if (paymentMethod === 'online') {
                const paymentRes = await createPaymentIntent(discountedPrice * 100);
                if (paymentRes?.data?.clientSecret) {
                    setClientSecret(paymentRes.data.clientSecret);
                }
            }
        } catch (err) {
            console.error('Payment Error:', err);
        }
    };

    const stripeOptions: StripeElementsOptions = {
        clientSecret: clientSecret ?? '',
        appearance: { theme: 'stripe' },
    };

    return (
        <div className="max-w-6xl w-full mx-auto p-6">
            <div className='flex flex-col lg:flex-row w-full gap-4'>

                <div className="p-6 space-y-4 w-full bg-white rounded-sm">
                    {/* Hotel Image */}
                    {hotel.images?.length > 0 && (
                        <img
                            src={hotel.images[0]}
                            className="w-full h-64 object-cover rounded-md"
                        />
                    )}

                    {/* Hotel & room */}
                    <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-bold">{hotel.name}</h2>
                        <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            {hotel.address}
                        </p>

                        <div className="flex flex-wrap gap-4 items-start md:items-center justify-center md:justify-start bg-slate-100 w-full rounded-md p-2">
                            {room.images?.length > 0 && (
                                <img
                                    src={room.images[0]}
                                    className="w-40 h-28 object-cover rounded-md border"
                                />
                            )}

                            <div className="space-y-1">
                                <Badge className="px-3 py-1 bg-blue-100 text-blue-700">
                                    {room.bedType}
                                </Badge>

                                <p className="font-semibold text-base text-gray-800">
                                    {room.name}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    {room.guest} guests max
                                </div>
                            </div>
                        </div>

                        {/* Booking details */}
                        <div className="bg-slate-100 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                <div className="flex items-start gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4 mt-0.5 text-blue-500" />
                                    <div>
                                        <div className="font-medium text-gray-700">Check-in</div>
                                        <div>
                                            {checkInDate.toLocaleString('en-IN', {
                                                day: '2-digit', weekday: 'short', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4 mt-0.5 text-blue-500" />
                                    <div>
                                        <div className="font-medium text-gray-700">Check-out</div>
                                        <div>
                                            {checkOutDate.toLocaleString('en-IN', {
                                                day: '2-digit', weekday: 'short', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-gray-600">
                                    <Users className="h-4 w-4 mt-0.5 text-green-500" />
                                    <div>
                                        <div className="font-medium text-gray-700">Guests</div>
                                        <div>
                                            {adults + children} total
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-gray-600">
                                    <Clock className="h-4 w-4 mt-0.5 text-purple-500" />
                                    <div>
                                        <div className="font-medium text-gray-700">Duration</div>
                                        <div>
                                            {days} night(s)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* final price */}
                        {selectedCoupon && (
                            <div className="mt-4 p-3 border rounded-lg bg-green-50">
                                <h3 className="font-semibold text-green-700 mb-1">Coupon Applied</h3>
                                <p className="text-sm">
                                    {selectedCoupon.code}:{" "}
                                    {selectedCoupon.type === 'flat'
                                        ? `₹${selectedCoupon.value} OFF`
                                        : `${selectedCoupon.value}% OFF`}
                                </p>

                                <div className="flex justify-between mt-2 font-medium text-green-800">
                                    <span>Final Price:</span>
                                    <span>₹{discountedPrice}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-4 w-full lg:w-1/2'>
                    {/* Price breakdown */}
                    <div className='p-4 bg-white rounded-sm w-full'>
                        <h3 className="font-semibold mb-3 text-lg underline underline-offset-5">
                            Price Summary
                        </h3>

                        <div className="text-sm space-y-2">
                            <div className="flex justify-between items-center">
                                <span>Room</span>
                                <span className='font-medium'>₹{room.basePrice}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Nights</span>
                                <span className='font-medium'>{days}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Number of Rooms</span>
                                <span className='font-medium'>{rooms}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Calculate</span>
                                <span className='font-medium'>{room.basePrice} × {days} × {rooms}</span>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className='uppercase font-semibold'>Total</span>
                                <span className='text-lg font-bold'>₹{room.basePrice * days * rooms}</span>
                            </div>
                        </div>
                    </div>

                    {/* Coupons */}
                    <div className='p-4 bg-white rounded-sm w-full'>
                        {coupons.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-3">Available Coupons</h3>

                                <div className="flex flex-col gap-3">
                                    {coupons.map((coupon) => (
                                        <div
                                            key={coupon.id}
                                            onClick={() =>
                                                selectedCoupon?.id === coupon.id
                                                    ? applyCoupon(null)
                                                    : applyCoupon(coupon)
                                            }
                                            className={`p-3 border rounded-lg cursor-pointer ${selectedCoupon?.id === coupon.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-300'
                                                }`}
                                        >
                                            <div className="flex justify-between">
                                                <span className="font-medium">{coupon.name}</span>
                                                <Badge>{coupon.code}</Badge>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                {coupon.type === 'flat'
                                                    ? `₹${coupon.value} OFF`
                                                    : `${coupon.value}% OFF`}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Minimum Price: ₹{coupon.minPrice}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment section */}
                    <div className='p-4 bg-white rounded-sm w-full'>
                        {!user ? (
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-gray-600 text-center">
                                    Login to complete your booking
                                </p>

                                <Button
                                    onClick={() => {
                                        dispatch(saveLastVisitedPath(window.location.pathname + window.location.search));
                                        navigate('/user/login');
                                    }}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg"
                                >
                                    Login to Continue
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Payment methods */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="font-semibold mb-1">
                                        Payment Section
                                    </h3>
                                    <label className={`w-full flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={() => setPaymentMethod('online')}
                                            className="hidden"
                                        />
                                        <CreditCard className="w-6 h-6" />
                                        <span>Online Payment</span>
                                    </label>

                                    <label className={`w-full flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="wallet"
                                            checked={paymentMethod === 'wallet'}
                                            onChange={() => setPaymentMethod('wallet')}
                                            className="hidden"
                                        />
                                        <Wallet className="w-6 h-6" />
                                        <span>Wallet {`(${wallet?.balance.toFixed(2)})`}</span>
                                    </label>
                                </div>

                                {/* confirm buttons */}
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
                                                onPaymentSuccess={finalizeBooking}
                                            />
                                        </Elements>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default BookingCheckout;
