import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArrowLeft, Send, CheckCircle, AlertCircle, User, Smartphone, AtSign } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface SendMoneyScreenProps {
  onBack: () => void;
  onSuccess: (amount: number, recipient: string) => void;
  currentBalance: number;
}

interface Contact {
  id: string;
  name: string;
  identifier: string;
  type: 'phone' | 'upi' | 'wallet';
}

export function SendMoneyScreen({ onBack, onSuccess, currentBalance }: SendMoneyScreenProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [recipientName, setRecipientName] = useState("");

  // Mock recent contacts
  const recentContacts: Contact[] = [
    { id: '1', name: 'John Doe', identifier: '+91 98765 43210', type: 'phone' },
    { id: '2', name: 'Jane Smith', identifier: 'jane@upi', type: 'upi' },
    { id: '3', name: 'Mike Wilson', identifier: 'wallet123', type: 'wallet' },
    { id: '4', name: 'Sarah Johnson', identifier: '+91 87654 32109', type: 'phone' },
  ];

  const handleContactSelect = (contact: Contact) => {
    setRecipient(contact.identifier);
    setRecipientName(contact.name);
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Smartphone className="h-4 w-4" />;
      case 'upi': return <AtSign className="h-4 w-4" />;
      case 'wallet': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const validateRecipient = (value: string) => {
    // Simple validation - in real app, this would check with backend
    if (value.includes('@')) {
      setRecipientName('UPI User');
    } else if (value.startsWith('+91') || value.match(/^\d+$/)) {
      setRecipientName('Phone User');
    } else {
      setRecipientName('Wallet User');
    }
  };

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    if (value.length > 5) {
      validateRecipient(value);
    } else {
      setRecipientName('');
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setShowConfirmation(false);
    
    try {
      // Call the real API through onSuccess callback
      // App.tsx will handle the actual API call to backend
      await onSuccess(parseInt(amount), recipient);
      setShowSuccess(true);
    } catch (error) {
      console.error('Transfer error:', error);
      setShowError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccess(false);
  };

  const isFormValid = () => {
    const amountNum = parseInt(amount);
    return recipient && amount && amountNum > 0 && amountNum <= currentBalance;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <Card className="glass-card border-0 card-hover">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="glass-card hover:scale-105 transition-transform rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 text-indigo-600" />
              </Button>
              <div>
                <CardTitle className="gradient-text text-xl font-bold">Send Money</CardTitle>
                <CardDescription className="text-slate-600">
                  Available balance: {formatCurrency(currentBalance)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recent Contacts */}
            <div className="space-y-3">
              <Label>Recent Contacts</Label>
              <div className="grid grid-cols-4 gap-3">
                {recentContacts.slice(0, 4).map((contact) => (
                  <Button
                    key={contact.id}
                    variant="outline"
                    className="h-auto flex-col gap-2 p-3"
                    onClick={() => handleContactSelect(contact)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs truncate w-full">{contact.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recipient Input */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Send to</Label>
              <Input
                id="recipient"
                placeholder="Phone number, UPI ID, or Wallet ID"
                value={recipient}
                onChange={(e) => handleRecipientChange(e.target.value)}
              />
              {recipientName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Sending to: {recipientName}</span>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
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
              {amount && parseInt(amount) > currentBalance && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient balance. Maximum amount: {formatCurrency(currentBalance)}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="What's this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-14 secondary-gradient border-0 text-white hover:scale-105 transition-all duration-300 rounded-2xl text-lg font-bold" 
              onClick={() => setShowConfirmation(true)}
              disabled={!isFormValid()}
              style={{ boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)' }}
            >
              <Send className="h-5 w-5 mr-2" />
              Send ₹{amount || 0}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-2xl rounded-[2rem] border-0 bg-white p-0 shadow-[0_30px_80px_rgba(20,13,68,0.35)]">
          <div className="px-6 pt-10 pb-8 sm:px-9">
            <div className="text-center">
              <DialogTitle className="text-3xl font-bold text-slate-900">
                Confirm Payment
              </DialogTitle>
              <DialogDescription className="mt-3 text-lg text-slate-600">
                Please review your payment details.
              </DialogDescription>
            </div>

              <div className="mt-8 rounded-[1.75rem] bg-[#eeebf9] px-5 py-6 sm:px-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="text-xl text-slate-600 sm:text-2xl">Amount</span>
                    <span className="text-2xl font-semibold sm:text-3xl">
                      {formatCurrency(parseInt(amount))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl text-slate-600 sm:text-2xl">Payment Method:</span>
                    <span className="flex items-center gap-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-700 to-violet-500 text-white sm:h-8 sm:w-8">
                        <CheckCircle className="h-5 w-5" />
                      </span>
                      UPI
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl text-slate-600 sm:text-2xl">Processing Fee:</span>
                    <span className="text-2xl font-semibold text-slate-900 sm:text-3xl">Rs 0</span>
                  </div>
                </div>

              <div className="my-6 h-px bg-[#d8d2f3]" />

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900 sm:text-3xl">Total:</span>
                <span className="text-2xl font-bold text-slate-900 sm:text-3xl">{formatCurrency(parseInt(amount))}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="h-14 rounded-2xl border-2 border-[#d8c9f8] bg-white text-xl font-semibold text-slate-900 hover:bg-[#f8f4ff] sm:text-2xl"
              >
                Cancel
              </Button>

              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="h-14 rounded-2xl border-0 bg-gradient-to-r from-[#7f3ff2] to-[#9b4dff] px-4 text-xl font-semibold text-white shadow-[0_10px_24px_rgba(127,63,242,0.35)] hover:brightness-105 sm:text-2xl"
              >
                {isProcessing ? "Sending..." : "Confirm Payment"}
              </Button>
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
            <DialogTitle>Money Sent Successfully!</DialogTitle>
            <DialogDescription>
              {formatCurrency(parseInt(amount))} sent to {recipientName}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleSuccess} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <DialogTitle>Transaction Failed</DialogTitle>
            <DialogDescription>
              Unable to process the transaction. Please try again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowError(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => {setShowError(false); setShowConfirmation(true);}} className="flex-1">
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
