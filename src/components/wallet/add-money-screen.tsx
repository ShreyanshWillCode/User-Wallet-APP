import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArrowLeft, CreditCard, Smartphone, Building, CheckCircle, AlertCircle, QrCode } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface AddMoneyScreenProps {
  onBack: () => void;
  onSuccess: (amount: number, method: string) => void;
}

export function AddMoneyScreen({ onBack, onSuccess }: AddMoneyScreenProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrPaymentId, setQrPaymentId] = useState("");

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setShowConfirmation(false);
    setShowSuccess(true);
  };

  const handleSuccess = () => {
    onSuccess(parseInt(amount), paymentMethod);
    setShowSuccess(false);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'upi': return <Smartphone className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'netbanking': return <Building className="h-5 w-5" />;
      case 'qr': return <QrCode className="h-5 w-5" />;
      default: return null;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'upi': return 'UPI';
      case 'card': return 'Debit/Credit Card';
      case 'netbanking': return 'Net Banking';
      case 'qr': return 'QR Code';
      default: return '';
    }
  };

  const handleQRPayment = () => {
    // Generate a mock payment ID for QR
    const paymentId = `QR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setQrPaymentId(paymentId);
    setShowQR(true);
  };

  const handleQRComplete = () => {
    setShowQR(false);
    setShowConfirmation(true);
  };

  const isFormValid = () => {
    if (!amount || !paymentMethod) return false;
    
    switch (paymentMethod) {
      case 'upi':
        return upiId.trim() !== '';
      case 'card':
        return cardNumber && cardExpiry && cardCvv && cardName;
      case 'netbanking':
        return true;
      case 'qr':
        return true;
      default:
        return false;
    }
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

              {amount && parseInt(amount) < 10 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Minimum amount to add is ₹10
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      UPI
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Debit/Credit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="netbanking">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Net Banking
                    </div>
                  </SelectItem>
                  <SelectItem value="qr">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      QR Code Payment
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'upi' && (
              <div className="space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={3}
                      type="password"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <Alert>
                <Building className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to your bank's website to complete the payment.
                </AlertDescription>
              </Alert>
            )}

            {paymentMethod === 'qr' && (
              <div className="space-y-4">
                <Alert>
                  <QrCode className="h-4 w-4" />
                  <AlertDescription>
                    Scan the QR code with any UPI app to make the payment instantly.
                  </AlertDescription>
                </Alert>
                <div className="text-center space-y-2">
                  <div className="text-sm text-tertiary-light font-medium">Or</div>
                  <Button
                    variant="outline"
                    onClick={handleQRPayment}
                    className="primary-gradient text-white border-0 hover:scale-105 transition-all duration-300"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </div>
            )}

            <Button 
              className="w-full h-14 primary-gradient border-0 button-glow hover:scale-105 transition-all duration-300 rounded-2xl text-lg font-bold" 
              onClick={() => paymentMethod === 'qr' ? handleQRPayment() : setShowConfirmation(true)}
              disabled={!isFormValid() || parseInt(amount) < 10}
            >
              {paymentMethod === 'qr' ? 'Generate QR & Pay' : `Add ₹${amount || 0} to Wallet`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please review your payment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>₹{amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <div className="flex items-center gap-2">
                  {getPaymentIcon(paymentMethod)}
                  <span>{getPaymentLabel(paymentMethod)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>₹0</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span>Total:</span>
                <span>₹{amount}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isProcessing} className="flex-1">
                {isProcessing ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="text-center max-w-sm">
          <DialogHeader>
            <DialogTitle className="gradient-text">Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan with any UPI app to pay ₹{amount}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Mock QR Code */}
            <div className="mx-auto w-48 h-48 bg-white rounded-2xl p-4 shadow-xl border-2 border-gray-100">
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-2 border-2 border-white/20 rounded-lg"></div>
                <div className="text-white space-y-1 text-center">
                  <QrCode className="h-16 w-16 mx-auto mb-2" />
                  <div className="text-xs font-mono opacity-80">QR Code</div>
                  <div className="text-xs font-mono opacity-60">₹{amount}</div>
                </div>
                {/* Decorative QR-like squares */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-sm"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-sm"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-sm"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-slate-600">Payment ID</div>
              <div className="font-mono text-xs bg-slate-100 p-2 rounded-lg">{qrPaymentId}</div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowQR(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleQRComplete} className="flex-1 success-gradient text-white">
                Payment Done
              </Button>
            </div>
            
            <div className="text-xs text-slate-500">
              Click "Payment Done" after completing the payment in your UPI app
            </div>
          </div>
        </DialogContent>
      </Dialog>

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