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
  <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl shadow-2xl border-0">

    {/* Header */}
    <div className="px-8 pt-8 pb-4 text-center">
      <DialogTitle className="text-2xl font-bold text-gray-900">
        Confirm Transaction
      </DialogTitle>
      <DialogDescription className="text-gray-500 mt-2 text-base">
        Please review your transaction details.
      </DialogDescription>
    </div>

    {/* Details Card */}
    <div className="px-8 pb-6">
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl space-y-5">

        {/* Recipient */}
        <div className="text-center">
          <Avatar className="h-14 w-14 mx-auto mb-3 shadow-md">
            <AvatarFallback className="bg-purple-600 text-white font-semibold">
              {recipientName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold text-gray-900">{recipientName}</p>
          <p className="text-sm text-gray-500">{recipient}</p>
        </div>

        <div className="border-t border-purple-200"></div>

        {/* Amount */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Amount</span>
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(parseInt(amount))}
          </span>
        </div>

        {/* Optional Note */}
        {note && (
          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">Note</span>
            <span className="text-sm text-gray-500 text-right max-w-[60%]">
              {note}
            </span>
          </div>
        )}

        <div className="border-t border-purple-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(parseInt(amount))}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="px-8 pb-8 flex gap-4">
      <Button
        variant="outline"
        onClick={() => setShowConfirmation(false)}
        className="flex-1 h-12 rounded-xl border-2 border-gray-200 font-semibold hover:bg-gray-50"
      >
        Cancel
      </Button>

      <Button
        onClick={handleConfirm}
        disabled={isProcessing}
        className="flex-1 h-12 rounded-xl font-semibold text-white 
                   bg-gradient-to-r from-purple-600 to-purple-500 
                   hover:from-purple-700 hover:to-purple-600
                   shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isProcessing ? "Sending..." : "Send Money"}
      </Button>
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