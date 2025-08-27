import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
    heading: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
        textDecoration: "underline",
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
        marginBottom: 4,
    },
    label: { fontWeight: "bold" },
    thankYou: {
        marginTop: 30,
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
    },
});

const InvoiceDoc: React.FC<{ booking: any; user: any }> = ({ booking, user }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Text style={styles.heading}>Travesta Booking Invoice</Text>

                {/* Invoice Info */}
                <View style={styles.section}>
                    <Text>
                        <Text style={styles.label}>Invoice ID:</Text> {booking._id}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Date:</Text>{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* User Details */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Customer Details</Text>
                    <Text>
                        <Text style={styles.label}>Name:</Text> {user?.firstName} {user?.lastName}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Email:</Text> {user?.email}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Phone:</Text> {user?.phone}
                    </Text>
                </View>

                {/* Booking Details */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Booking Details</Text>
                    <Text>
                        <Text style={styles.label}>Hotel:</Text>{" "}
                        {typeof booking.hotelId === "object" ? booking.hotelId.name : ""}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Room:</Text>{" "}
                        {typeof booking.roomId === "object" ? booking.roomId.name : ""}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Check-in:</Text> {booking.checkIn}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Check-out:</Text> {booking.checkOut}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Guests:</Text> {booking.guests}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Status:</Text> {booking.status}
                    </Text>
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Payment Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Price:</Text>
                        <Text>Rs {booking.totalPrice}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Payment Status:</Text>
                        <Text>{booking.payment?.status}</Text>
                    </View>
                </View>

                {/* Thank You */}
                <Text style={styles.thankYou}>
                    ✅ Thank you for booking with us. We look forward to hosting you!
                </Text>
            </Page>
        </Document>
    );
};

export default InvoiceDoc;
