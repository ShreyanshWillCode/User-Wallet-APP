import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArrowLeft, Plus, CheckCircle, AlertCircle, Building, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface BankAccount {
  id: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolder: string;
  isDefault: boolean;
}

interface WithdrawScreenProps {
  onBack: () => void;
  onSuccess: (amount: number, account: string) => void;
  currentBalance: number;
}

export function WithdrawScreen({ onBack, onSuccess, currentBalance }: WithdrawScreenProps) {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock bank accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      accountNumber: '****1234',
      ifscCode: 'HDFC0000123',
      bankName: 'HDFC Bank',
      accountHolder: 'John Doe',
      isDefault: true
    },
    {
      id: '2',
      accountNumber: '****5678',
      ifscCode: 'ICIC0000456',
      bankName: 'ICICI Bank',
      accountHolder: 'John Doe',
      isDefault: false
    }
  ]);

  // Add account form state
  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolder: ''
  });

  const handleAddAccount = () => {
    const account: BankAccount = {
      id: Date.now().toString(),
      accountNumber: `****${newAccount.accountNumber.slice(-4)}`,
      ifscCode: newAccount.ifscCode,
      bankName: newAccount.bankName,
      accountHolder: newAccount.accountHolder,
      isDefault: bankAccounts.length === 0
    };
    
    setBankAccounts([...bankAccounts, account]);
    setNewAccount({ accountNumber: '', ifscCode: '', bankName: '', accountHolder: '' });
    setShowAddAccount(false);
    setSelectedAccount(account.id);
  };

  const handleRemoveAccount = (accountId: string) => {
    setBankAccounts(bankAccounts.filter(acc => acc.id !== accountId));
    if (selectedAccount === accountId) {
      setSelectedAccount('');
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    // Simulate withdrawal processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowConfirmation(false);
    setShowSuccess(true);
  };

  const handleSuccess = () => {
    const account = bankAccounts.find(acc => acc.id === selectedAccount);
    onSuccess(parseInt(amount), account?.bankName || '');
    setShowSuccess(false);
  };

  const isFormValid = () => {
    const amountNum = parseInt(amount);
    return selectedAccount && amount && amountNum > 0 && amountNum <= currentBalance;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const selectedAccountDetails = bankAccounts.find(acc => acc.id === selectedAccount);

  return (
    <div className="min-h-screen p-4 bg-[rgba(9,9,46,1)]">
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
                <CardTitle className="gradient-text text-xl font-bold">Withdraw Money</CardTitle>
                <CardDescription className="text-slate-600">
                  Available balance: {formatCurrency(currentBalance)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Account Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Bank Account</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddAccount(true)}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              {bankAccounts.length === 0 ? (
                <Alert>
                  <Building className="h-4 w-4" />
                  <AlertDescription>
                    No bank accounts linked. Please add a bank account to withdraw money.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedAccount === account.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAccount(account.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-full">
                            <Building className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm">{account.bankName}</p>
                            <p className="text-xs text-muted-foreground">
                              {account.accountNumber} • {account.ifscCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {account.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAccount(account.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg h-12"
                  disabled={bankAccounts.length === 0}
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
              {amount && parseInt(amount) < 100 && parseInt(amount) > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Minimum withdrawal amount is ₹100
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Withdrawal Info */}
            {selectedAccountDetails && (
              <Alert>
                <Building className="h-4 w-4" />
                <AlertDescription>
                  Money will be transferred to your {selectedAccountDetails.bankName} account ending in {selectedAccountDetails.accountNumber.slice(-4)}. It typically takes 1-2 business days to reflect.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              className="w-full h-14 warning-gradient border-0 text-white hover:scale-105 transition-all duration-300 rounded-2xl text-lg font-bold" 
              onClick={() => setShowConfirmation(true)}
              disabled={!isFormValid() || parseInt(amount) < 100}
              style={{ boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)' }}
            >
              Withdraw ₹{amount || 0}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Account Dialog */}
      <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Enter your bank account details for withdrawals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-holder">Account Holder Name</Label>
              <Input
                id="account-holder"
                placeholder="As per bank records"
                value={newAccount.accountHolder}
                onChange={(e) => setNewAccount({...newAccount, accountHolder: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="1234567890"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input
                id="ifsc"
                placeholder="HDFC0000123"
                value={newAccount.ifscCode}
                onChange={(e) => setNewAccount({...newAccount, ifscCode: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                placeholder="HDFC Bank"
                value={newAccount.bankName}
                onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddAccount(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleAddAccount} 
                className="flex-1"
                disabled={!newAccount.accountHolder || !newAccount.accountNumber || !newAccount.ifscCode || !newAccount.bankName}
              >
                Add Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Please review your withdrawal details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="text-lg">{formatCurrency(parseInt(amount))}</span>
              </div>
              <div className="flex justify-between">
                <span>To Account:</span>
                <span>{selectedAccountDetails?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Number:</span>
                <span>{selectedAccountDetails?.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Time:</span>
                <span>1-2 business days</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isProcessing} className="flex-1">
                {isProcessing ? "Processing..." : "Confirm Withdrawal"}
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
            <DialogTitle>Withdrawal Initiated!</DialogTitle>
            <DialogDescription>
              {formatCurrency(parseInt(amount))} will be transferred to your bank account within 1-2 business days.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleSuccess} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}