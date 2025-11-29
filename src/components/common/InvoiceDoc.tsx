import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        alignItems: "center",
    },
    logo: { width: 70, height: 70, borderRadius: 6 },
    heading: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        textDecoration: "underline",
        flex: 1,
    },
    section: {
        marginBottom: 15,
        paddingBottom: 8,
        borderBottom: "1px solid #ccc",
    },
    subHeading: {
        fontSize: 14,
        marginBottom: 8,
        textDecoration: "underline",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    label: { fontWeight: "bold" },
    hotelImage: {
        marginTop: 10,
        width: "100%",
        height: 180,
        borderRadius: 8,
        objectFit: "cover",
    },
    thankYou: {
        marginTop: 25,
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
    },
});

const InvoiceDoc: React.FC<{ booking: any; user: any }> = ({
    booking,
    user,
}) => {
    const GST_PERCENTAGE = 10;
    const gstAmount = (booking.totalPrice * GST_PERCENTAGE) / 100;

    const hotel =
        typeof booking.hotelId === "object" ? booking.hotelId : { name: "", state: "", city: "", images: [] };
    const room =
        typeof booking.roomId === "object" ? booking.roomId : { name: "" };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header with Logo */}
                <View style={styles.header}>
                    <Text style={styles.heading}>Travesta Booking Invoice</Text>
                </View>

                {/* Invoice Info */}
                <View style={styles.section}>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Date: </Text>
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* Customer Details */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Customer Details</Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Name: </Text>
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Email: </Text>
                        {user?.email}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Phone: </Text>
                        {user?.phone}
                    </Text>
                </View>

                {/* Booking Details */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Booking Details</Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Hotel: </Text>
                        {hotel.name}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Location: </Text>
                        {hotel.city}, {hotel.state}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Room: </Text>
                        {room.name}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Check-in: </Text>
                        {booking.checkIn}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Check-out: </Text>
                        {booking.checkOut}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Guests: </Text>
                        {booking.guests}
                    </Text>
                    <Text style={styles.row}>
                        <Text style={styles.label}>Status: </Text>
                        {booking.status}
                    </Text>

                    {/* Hotel image */}
                    {/* <Image style={styles.hotelImage} src={hotelImage} /> */}
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Payment Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>GST ({GST_PERCENTAGE}%):</Text>
                        <Text>Rs {gstAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Price (incl. GST):</Text>
                        <Text>Rs {booking.totalPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Payment Status:</Text>
                        <Text>{booking.payment}</Text>
                    </View>
                </View>

                {/* Thank You */}
                <Text style={styles.thankYou}>
                    ✅ Thank you for booking with Travesta. We look forward to hosting you!
                </Text>
            </Page>
        </Document>
    );
};

export default InvoiceDoc;
