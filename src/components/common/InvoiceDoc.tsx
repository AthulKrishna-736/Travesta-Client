import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { IBooking } from "@/types/booking.types";
import { IUser } from "@/types/user.types";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: "Helvetica",
        lineHeight: 1.5,
    },
    heading: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
    },

    section: {
        marginBottom: 15,
        paddingBottom: 8,
        borderBottom: "1pt solid #ccc",
    },
    subHeading: {
        fontSize: 14,
        marginBottom: 6,
        fontWeight: "bold",
        textDecoration: "underline",
    },
    row: {
        marginBottom: 4,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: { fontWeight: "bold" },

    thankYou: {
        marginTop: 15,
        textAlign: "center",
        fontStyle: "italic",
    },
});

const GST_SLABS = [
    { min: 0, max: 999, percent: 0 },
    { min: 1000, max: 7499, percent: 5 },
    { min: 7500, max: Infinity, percent: 18 },
];

const getGSTPercent = (price: number) => GST_SLABS.find((s) => price >= s.min && price <= s.max)?.percent ?? 0;

const InvoiceDoc: React.FC<{ booking: IBooking; user: IUser; qrImageUrl: string }> = ({ booking, user, qrImageUrl }) => {

    const gstPercent = getGSTPercent(booking.totalPrice);
    const gstAmount = Math.round((booking.totalPrice * gstPercent) / 100);

    let originalAmount = booking.totalPrice;
    let discountAmount = 0;

    if (booking.coupon) {
        if (booking.coupon.type === "flat") {
            discountAmount = booking.coupon.value;
            originalAmount = booking.totalPrice + discountAmount;
        }

        if (booking.coupon.type === "percent") {
            originalAmount = Math.round(booking.totalPrice / (1 - booking.coupon.value / 100));
            discountAmount = originalAmount - booking.totalPrice;
        }
    }

    const hotel = booking.hotel ?? { name: "", city: "", state: "", images: [] };
    const room = booking.room ?? { name: "" };

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Main Heading */}
                <Text style={styles.heading}>Travesta — Booking Invoice</Text>

                {/* Booking Basic Info with QR */}
                <View style={[styles.section, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>

                    {/* Left side — booking info (placeholder + value) */}
                    <View style={{ flexDirection: "column", gap: 4 }}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Invoice Date:</Text>
                            <Text>{new Date(booking.createdAt).toLocaleDateString()}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Booking ID:</Text>
                            <Text>{booking.bookingId ? booking.bookingId : booking.id.slice(-8)}</Text>
                        </View>
                    </View>

                    {/* Right side — QR only */}
                    <View style={{ width: 110, height: 110, justifyContent: "center", alignItems: "center" }}>
                        <Image src={qrImageUrl} style={{ width: 100, height: 100 }} />
                    </View>
                </View>

                {/* Customer Details */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Customer Details</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text>{user.firstName} {user.lastName}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Email:</Text>
                        <Text>{user.email}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Phone:</Text>
                        <Text>{user.phone}</Text>
                    </View>
                </View>

                {/* Booking Details */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Booking Details</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Hotel:</Text>
                        <Text>{hotel.name}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Location:</Text>
                        <Text>{hotel.city}, {hotel.state}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Room:</Text>
                        <Text>{room.name}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Check-In:</Text>
                        <Text>{booking.checkIn}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Check-Out:</Text>
                        <Text>{booking.checkOut}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Guests:</Text>
                        <Text>{booking.guests}</Text>
                    </View>

                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Payment Summary</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>GST ({gstPercent}%):</Text>
                        <Text>Rs {gstAmount}</Text>
                    </View>

                    {booking.coupon && (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>Original Amount:</Text>
                                <Text>Rs {originalAmount}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    Coupon ({booking.coupon.name})
                                </Text>
                                <Text>Rs {discountAmount}</Text>
                            </View>
                        </>
                    )}

                    <View style={styles.row}>
                        <Text style={styles.label}>Total Price:</Text>
                        <Text>Rs {booking.totalPrice}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Payment Status:</Text>
                        <Text>{booking.payment}</Text>
                    </View>
                </View>

                <Text style={styles.thankYou}>
                    Thank you for booking with Travesta! We look forward to hosting you.
                </Text>
            </Page>
        </Document>
    );
};

export default InvoiceDoc;
