import { useState, useEffect } from "react";
import Header from "@/components/vendor/Header";
import Sidebar from "@/components/vendor/Sidebar";
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
import CheckoutForm, { PaymentSuccessData } from "@/components/wallet/CheckoutForm";
import { useAddWalletCredit, useCreatePaymentIntent, useCreateWallet, useGetWallet } from "@/hooks/user/useWallet";
import WalletSection from "@/components/wallet/Wallet";

const stripePromise = loadStripe(env.STRIPE_SECRET);

const VendorWalletPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const navigate = useNavigate();
    const limit = 5;

    const { data: walletDataResponse, isLoading: walletLoading } = useGetWallet(page, limit);
    const { mutateAsync: addWalletCredit } = useAddWalletCredit();

    const { mutateAsync: createWallet } = useCreateWallet();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();

    const walletData = walletDataResponse?.data ?? null;
    const meta = walletDataResponse?.meta;

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
                setAmount('');
                setDialogOpen(false);
                setShowPayment(true);
            }
        } catch (error) {
            console.error("Payment intent creation error", error);
        }
    };

    const handlePaymentSuccess = async (data: PaymentSuccessData) => {
        if (data.type === "wallet") {
            await addWalletCredit({
                amount: data.amount,
                transactionId: data.transactionId,
            });
            navigate("/vendor/wallet");
        }
    };

    const stripeOptions: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: "stripe" },
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} />
                <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-13'}`}>
                    <div className="container mx-auto animate-fade-in">
                        <h2 className="text-2xl font-semibold mb-4">Vendor Wallet</h2>

                        {/* Wallet Section */}
                        {!walletLoading && walletData && (
                            <WalletSection
                                balance={walletData.balance}
                                transactions={walletData.transactions || []}
                                userName={walletData.user?.name || "Vendor"}
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
                                    isForBooking={false}
                                />
                            </Elements>
                        )}

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <Pagination
                                currentPage={meta.currentPage}
                                totalPages={meta.totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VendorWalletPage;
