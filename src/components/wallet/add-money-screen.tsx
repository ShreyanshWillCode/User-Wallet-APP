import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { initiateRazorpayPayment } from "../../utils/razorpay";

interface AddMoneyScreenProps {
  onBack: () => void;
  onSuccess: (amount: number, method: string) => void;
}

export function AddMoneyScreen({ onBack, onSuccess }: AddMoneyScreenProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setError("");
  };

  const handlePayment = async () => {
    const amountNum = parseInt(amount);
    
    if (amountNum < 10) {
      setError("Minimum amount is ₹10");
      return;
    }

    if (amountNum > 100000) {
      setError("Maximum amount is ₹1,00,000");
      return;
    }

    setIsProcessing(true);
    setError("");

    await initiateRazorpayPayment(
      amountNum,
      () => {
        // Payment successful
        setIsProcessing(false);
        setShowSuccess(true);
      },
      (errorMsg) => {
        // Payment failed
        setIsProcessing(false);
        setError(errorMsg);
      }
    );
  };

  const handleSuccess = () => {
    onSuccess(parseInt(amount), 'razorpay');
    setShowSuccess(false);
  };

  const isFormValid = () => {
    const amountNum = parseInt(amount);
    return amount && amountNum >= 10 && amountNum <= 100000;
  };

  return (
    <div className="min-h-screen p-4 bg-[rgba(9,9,46,1)]">
      <div className="max-w-md mx-auto">
        <Card className="surface-primary border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="interactive-primary hover:scale-105 transition-transform rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 text-accent-blue" />
              </Button>
              <div>
                <CardTitle className="text-primary-light text-xl font-bold">Add Money</CardTitle>
                <CardDescription className="text-tertiary-light">Top up your wallet balance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Enter Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 text-lg h-12"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <Label className="text-sm text-secondary-light font-semibold">Quick amounts</Label>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {quickAmounts.map((quickAmount, index) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(quickAmount)}
                      className="surface-secondary text-xs font-semibold text-accent-blue border-2 border-blue-200/30 hover:border-blue-400/50 hover:scale-105 hover:shadow-lg transition-all duration-300 rounded-xl h-12"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      ₹{quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Validation Message */}
              {amount && parseInt(amount) < 10 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Minimum amount to add is ₹10
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Payment Info */}
            <Alert>
              <AlertDescription className="text-sm">
                You will be redirected to Razorpay's secure payment gateway to complete the transaction.
              </AlertDescription>
            </Alert>

            {/* Pay Button */}
            <Button 
              className="w-full h-14 primary-gradient border-0 button-glow hover:scale-105 transition-all duration-300 rounded-2xl text-lg font-bold" 
              onClick={handlePayment}
              disabled={!isFormValid() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount || 0}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle>Payment Successful!</DialogTitle>
            <DialogDescription>
              ₹{amount} has been added to your wallet
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleSuccess} className="w-full">
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}