import React, { useEffect, useState } from "react";
import WalletSection from "@/components/wallet/Wallet";
import Pagination from "@/components/common/Pagination";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { env } from "@/config/config";
import CheckoutForm from "@/components/wallet/CheckoutForm";
import { useAddWalletCredit, useCreatePaymentIntent, useCreateWallet, useGetUserTransactions, useGetWallet } from "@/hooks/user/useWallet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showError } from "@/utils/customToast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { TPagination } from "@/types/custom.types";
import UserLayout from "@/components/layouts/UserLayout";

const stripePromise = loadStripe(env.STRIPE_SECRET);

const UserWallet: React.FC = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const limit = 5;

    // queries
    const { data: walletDataResponse, isLoading: walletLoading } = useGetWallet();
    const { data: transactionDataResponse, isLoading: transactionLoading } = useGetUserTransactions(page, limit)

    // mutation functions
    const { mutateAsync: addWalletCredit } = useAddWalletCredit();
    const { mutateAsync: createWallet } = useCreateWallet();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();

    const walletData = walletDataResponse?.data ?? null;
    const transactionData = transactionDataResponse?.data ?? null;
    const meta = transactionDataResponse?.meta as TPagination ?? null;

    useEffect(() => {
        if (walletDataResponse && walletDataResponse.success && !walletDataResponse.data) {
            createWallet();
        }
    }, [walletDataResponse, createWallet]);

    const handleWalletPaymentSuccess = async () => {
        await addWalletCredit(Number(amount));
        navigate('/user/wallet');
    };

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
        <UserLayout>
            <>
                {/* Dialog shared between components */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    {/* Wallet Section */}
                    {!walletLoading && walletData && (
                        <WalletSection
                            balance={walletData.balance}
                            transactions={transactionData || []}
                            userName={walletData.user?.name || "User"}
                            loading={transactionLoading}
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
                        <CheckoutForm
                            open={showPayment}
                            onClose={() => setShowPayment(false)}
                            onPaymentSuccess={handleWalletPaymentSuccess}
                        />
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
            </>
        </UserLayout>
    );
};

export default UserWallet;
