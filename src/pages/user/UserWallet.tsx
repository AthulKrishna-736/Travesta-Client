import React, { useState } from "react";
import Header from "@/components/common/Header";
import WalletSection from "@/components/wallet/Wallet";
import Pagination from "@/components/common/Pagination";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { env } from "@/config/config";
import { createPaymentIntent } from "@/services/userService";
import CheckoutForm from "@/components/wallet/CheckoutForm";

const stripePromise = loadStripe(env.STRIPE_SECRET);

const UserWallet: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const handleAddMoney = async () => {
        try {
            const response = await createPaymentIntent(5000);
            const clientSecret = response.data.clientSecret;
            setClientSecret(clientSecret);
            setShowPayment(true);
        } catch (error) {
            console.error("Error creating payment intent:", error);
        }
    };


    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: "stripe" as const,
        },
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-background px-4 py-6 mt-4">
                <div className="mx-auto max-w-6xl space-y-6">
                    <h1 className="text-3xl font-bold">Your Wallet</h1>

                    <button
                        onClick={handleAddMoney}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Add $50 to Wallet
                    </button>

                    {showPayment && clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )}

                    <WalletSection
                        balance={1560.75}
                        transactions={[]} // supply your paginatedTransactions
                        userName="John"
                    />

                    {/* Example Pagination */}
                    {/* totalPages needs to be declared */}
                    {/* {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )} */}
                </div>
            </main>
        </div>
    );
};

export default UserWallet;
