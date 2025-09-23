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
import { useAddWalletCredit, useCreatePaymentIntent, useCreateWallet, useGetVendorTransactions, useGetWallet } from "@/hooks/user/useWallet";
import WalletSection from "@/components/wallet/Wallet";
import VendorLayout from "@/components/layouts/VendorLayout";

const stripePromise = loadStripe(env.STRIPE_SECRET);

const VendorWalletPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [amount, setAmount] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const TRANSACTION_LIMIT = 5;

    //queries
    const { data: walletDataResponse, isLoading: walletLoading } = useGetWallet();
    const { data: transactionDataResponse, isLoading: transactionLoading } = useGetVendorTransactions(page, TRANSACTION_LIMIT)

    //mutation functions
    const { mutateAsync: addWalletCredit } = useAddWalletCredit();
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
            const secret = res?.data?.clientSecret;
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
        await addWalletCredit(Number(amount));
        navigate("/vendor/wallet");
    };

    const stripeOptions: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: "stripe" },
    };

    return (
        <VendorLayout>
            <>
                {/* Wallet Section */}
                {!walletLoading && walletData && (
                    <WalletSection
                        balance={walletData.balance}
                        transactions={transactionData || []}
                        userName={walletData.user?.name || "Vendor"}
                        loading={transactionLoading}
                        addMoney={() => setDialogOpen(true)}
                    />
                )}

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
                            <Button onClick={handleAddMoney} disabled={!amount}>
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
