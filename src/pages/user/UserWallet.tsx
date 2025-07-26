import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import WalletSection from "@/components/wallet/Wallet";
import Pagination from "@/components/common/Pagination";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { env } from "@/config/config";
import CheckoutForm from "@/components/wallet/CheckoutForm";
import { useCreatePaymentIntent, useCreateWallet, useGetWallet } from "@/hooks/user/useWallet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showError } from "@/utils/customToast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const stripePromise = loadStripe(env.STRIPE_SECRET);

const UserWallet: React.FC = () => {
    const [page, setPage] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const limit = 5;

    const { data: walletDataResponse, isLoading: walletLoading } = useGetWallet(page, limit);
    const { mutateAsync: createWallet } = useCreateWallet();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();

    const walletData = walletDataResponse?.data ?? null;
    const meta = walletDataResponse?.meta ?? null;

    useEffect(() => {
        if (walletDataResponse && walletDataResponse.success && !walletDataResponse.data) {
            createWallet();
        }
    }, [walletDataResponse, createWallet]);

    const handleAddMoney = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            showError("Please enter a valid amount.");
            return;
        }

        if (numericAmount > 2000) {
            showError("You can only add up to ₹2000 at a time.");
            return;
        }

        try {
            const res = await createPaymentIntent(numericAmount * 100);
            const clientSecret = res?.data?.clientSecret;
            if (clientSecret) {
                setClientSecret(clientSecret);
                setAmount('');
                setShowPayment(true);
                setDialogOpen(false);
            }
        } catch (error) {
            console.error("Error creating payment intent:", error);
        }
    };

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: "stripe",
        },
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-gray-100 px-4 py-6 mt-4">
                <div className="mx-auto max-w-6xl space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800">Your Wallet</h1>

                    {/* Dialog shared between components */}
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        {/* Wallet Section */}
                        {!walletLoading && walletData && (
                            <WalletSection
                                balance={walletData.balance}
                                transactions={walletData.transactions || []}
                                userName={walletData.user?.name || "User"}
                                addMoney={() => setDialogOpen(true)}
                            />
                        )}

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Money</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-2">
                                <Label htmlFor="amount">Enter Amount (Max ₹2000)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min={1}
                                    max={2000}
                                    placeholder="Enter amount in ₹"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <DialogFooter className="mt-4">
                                <Button onClick={handleAddMoney} disabled={!amount}>
                                    Add to Wallet
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Payment Section */}
                    {showPayment && clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm open={showPayment} onClose={() => setShowPayment(false)} />
                        </Elements>
                    )}

                    {/* Pagination */}
                    {meta && meta.totalPages > 0 && (
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserWallet;
