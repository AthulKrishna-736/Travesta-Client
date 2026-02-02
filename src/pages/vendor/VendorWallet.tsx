import { useState, useEffect } from "react";
import Pagination from "@/components/common/Pagination";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { env } from "@/config/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showError } from "@/utils/customToast";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "@/components/wallet/CheckoutForm";
import { useCreatePaymentIntent, useCreateWallet, useGetVendorTransactions, useGetWallet } from "@/hooks/user/useWallet";
import WalletSection from "@/components/wallet/Wallet";
import VendorLayout from "@/components/layouts/VendorLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { TApiSuccessResponse } from "@/types/custom.types";
import { IWallet } from "@/types/wallet.types";

const stripePromise = loadStripe(env.STRIPE_SECRET);

const VendorWalletPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [amount, setAmount] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const vendorName = useSelector((state: RootState) => state.user.user?.firstName);
    const TRANSACTION_LIMIT = 5;

    //queries
    const { data: walletDataResponse, isLoading: walletLoading } = useGetWallet();
    const { data: transactionDataResponse, isLoading: transactionLoading } = useGetVendorTransactions(page, TRANSACTION_LIMIT)

    //mutation functions
    const { mutateAsync: createWallet } = useCreateWallet();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();

    const walletData = walletDataResponse?.data ?? null;
    const transactionData = transactionDataResponse?.data ?? null;
    const meta = transactionDataResponse?.meta;

    useEffect(() => {
        if (walletDataResponse && walletDataResponse.success && !walletDataResponse.data) {
            createWallet();
        }
    }, [walletDataResponse, createWallet]);

    const handleAddMoney = async () => {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            showError("Please enter a valid amount.");
            return;
        }

        if (numericAmount < 50) {
            showError('Amount must be at least 50');
            return;
        }

        if (numericAmount > 2000) {
            showError("You can only add up to ₹2000 at a time.");
            return;
        }

        try {
            const res = await createPaymentIntent({ amount: numericAmount, purpose: 'wallet' });
            const secret = res.data.clientSecret;
            if (secret) {
                setClientSecret(secret);
                setDialogOpen(false);
                setShowPayment(true);
            }
        } catch (error) {
            console.error("Payment intent creation error", error);
        }
    };

    const handlePaymentSuccess = async () => {
        queryClient.setQueryData(['wallet'], (old: TApiSuccessResponse<IWallet>) => {
            if (!old?.data) return old;

            return {
                ...old,
                data: {
                    ...old.data,
                    balance: old.data.balance + Number(amount),
                },
            };
        });
        await queryClient.refetchQueries({ queryKey: ['transactions'] });
        navigate("/vendor/wallet");
    };

    const stripeOptions: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: 'flat' },
        loader: 'always',
    };

    return (
        <VendorLayout>
            <>
                {/* Wallet Section */}
                {walletLoading ? (
                    <div className="mt-10 mx-auto max-w-xl px-6 py-8 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-center shadow-sm animate-pulse">
                        <h2 className="text-lg font-semibold mb-2">
                            Loading Wallet...
                        </h2>
                        <p className="text-sm">
                            Fetching your balance and transactions.
                        </p>

                        <div className="mt-4 space-y-3">
                            <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto" />
                            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
                            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto" />
                        </div>
                    </div>
                ) : walletData ? (
                    <WalletSection
                        balance={walletData.balance}
                        transactions={transactionData || []}
                        userName={vendorName || "Vendor"}
                        loading={transactionLoading}
                        addMoney={() => setDialogOpen(true)}
                    />
                ) : null}

                {/* Dialog for Add Money */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                            <Button onClick={handleAddMoney} disabled={!amount} className="cursor-pointer">
                                Add to Wallet
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Payment Section */}
                {showPayment && clientSecret && (
                    <Elements stripe={stripePromise} options={stripeOptions}>
                        <CheckoutForm
                            open={showPayment}
                            onClose={() => setShowPayment(false)}
                            onPaymentSuccess={handlePaymentSuccess}
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
        </VendorLayout >
    );
};

export default VendorWalletPage;
