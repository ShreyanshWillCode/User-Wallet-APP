import React, { useState, useEffect } from "react";
import { LoginScreen } from "./components/auth/login-screen";
import { KYCScreen } from "./components/kyc/kyc-screen";
import { WalletDashboard } from "./components/wallet/wallet-dashboard";
import { AddMoneyScreen } from "./components/wallet/add-money-screen";
import { SendMoneyScreen } from "./components/wallet/send-money-screen";
import { TransactionHistory } from "./components/wallet/transaction-history";
import { WithdrawScreen } from "./components/wallet/withdraw-screen";
import { ProfileScreen } from "./components/profile/profile-screen";
import { useAuth } from "./contexts/AuthContext";
import { walletAPI, transactionsAPI } from "./services/api";
import toast from "react-hot-toast";

type AppScreen = 
  | 'login' 
  | 'kyc' 
  | 'dashboard' 
  | 'add-money' 
  | 'send-money' 
  | 'transaction-history' 
  | 'withdraw' 
  | 'profile';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  category: 'add_money' | 'send_money' | 'withdraw' | 'refund';
  recipient?: string;
}

interface UserInfo {
  name: string;
  phone: string;
  email: string;
  kycStatus: 'verified' | 'pending' | 'not_started';
}

export default function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoadingData(true);
    try {
      // Load wallet balance
      const balanceResponse = await walletAPI.getBalance();
      setWalletBalance(balanceResponse.data.balance);

      // Load transactions
      const transactionsResponse = await transactionsAPI.getTransactions({ limit: 20 });
      const formattedTransactions = transactionsResponse.data.transactions.map((tx: any) => ({
        id: tx._id,
        type: tx.direction,
        amount: tx.amount,
        description: tx.description,
        timestamp: tx.createdAt,
        status: tx.status,
        category: tx.type,
        recipient: tx.receiverId?.name
      }));
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle screen navigation based on authentication and KYC status
  useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize
    
    if (!isAuthenticated) {
      setCurrentScreen('login');
    } else if (user) {
      // Check KYC status and navigate accordingly
      if (user.kycStatus === 'verified') {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('kyc');
    }
    }
  }, [isAuthenticated, user, isLoading]);

  const handleKYCComplete = async () => {
    try {
      // In a real app, you would call an API to update KYC status
      // For now, we'll just refresh user data
      await loadUserData();
    setCurrentScreen('dashboard');
      toast.success('KYC verification completed!');
    } catch (error) {
      console.error('KYC completion error:', error);
      toast.error('Failed to complete KYC verification');
    }
  };

  const handleAddMoneySuccess = async (amount: number, method: string) => {
    try {
      await walletAPI.addMoney({ amount, paymentMethod: method });
      await loadUserData(); // Refresh balance and transactions
    setCurrentScreen('dashboard');
      toast.success(`₹${amount} added successfully!`);
    } catch (error: any) {
      console.error('Add money error:', error);
      toast.error(error.response?.data?.message || 'Failed to add money');
    }
  };

  const handleSendMoneySuccess = async (amount: number, recipient: string) => {
    try {
      await walletAPI.transfer({ 
        recipient, 
      amount,
        description: `Money sent to ${recipient}` 
      });
      await loadUserData(); // Refresh balance and transactions
    setCurrentScreen('dashboard');
      toast.success(`₹${amount} sent to ${recipient} successfully!`);
    } catch (error: any) {
      console.error('Send money error:', error);
      toast.error(error.response?.data?.message || 'Failed to send money');
    }
  };

  const handleWithdrawSuccess = async (amount: number, account: string) => {
    try {
      // For withdrawal, we need bank details - this would come from the withdraw screen
      // For now, we'll use mock bank details
      const bankDetails = {
        accountNumber: account,
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
        accountHolder: user?.name || 'User'
      };
      
      await walletAPI.withdraw({ amount, bankDetails });
      await loadUserData(); // Refresh balance and transactions
    setCurrentScreen('dashboard');
      toast.success(`₹${amount} withdrawal initiated successfully!`);
    } catch (error: any) {
      console.error('Withdraw error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate withdrawal');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    setCurrentScreen('login');
      setWalletBalance(0);
    setTransactions([]);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onBack={() => setCurrentScreen('login')}
          />
        );
      
      case 'kyc':
        return (
          <KYCScreen
            onKYCComplete={handleKYCComplete}
            onBack={() => setCurrentScreen('login')}
          />
        );
      
      case 'dashboard':
        return (
          <WalletDashboard
            balance={walletBalance}
            userName={user?.name || 'User'}
            onAddMoney={() => setCurrentScreen('add-money')}
            onSendMoney={() => setCurrentScreen('send-money')}
            onWithdraw={() => setCurrentScreen('withdraw')}
            onTransactionHistory={() => setCurrentScreen('transaction-history')}
            onProfile={() => setCurrentScreen('profile')}
            transactions={transactions}
          />
        );
      
      case 'add-money':
        return (
          <AddMoneyScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSuccess={handleAddMoneySuccess}
          />
        );
      
      case 'send-money':
        return (
          <SendMoneyScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSuccess={handleSendMoneySuccess}
            currentBalance={walletBalance}
          />
        );
      
      case 'transaction-history':
        return (
          <TransactionHistory
            onBack={() => setCurrentScreen('dashboard')}
            transactions={transactions}
          />
        );
      
      case 'withdraw':
        return (
          <WithdrawScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSuccess={handleWithdrawSuccess}
            currentBalance={walletBalance}
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen
            onBack={() => setCurrentScreen('dashboard')}
            onLogout={handleLogout}
            userInfo={{
              name: user?.name || '',
              phone: user?.phone || '',
              email: user?.email || '',
              kycStatus: user?.kycStatus || 'not_started'
            }}
          />
        );
      
      default:
        return null;
    }
  };

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {renderScreen()}
    </div>
  );
}