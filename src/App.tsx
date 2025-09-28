import React, { useState } from "react";
import { LoginScreen } from "./components/auth/login-screen";
import { KYCScreen } from "./components/kyc/kyc-screen";
import { WalletDashboard } from "./components/wallet/wallet-dashboard";
import { AddMoneyScreen } from "./components/wallet/add-money-screen";
import { SendMoneyScreen } from "./components/wallet/send-money-screen";
import { TransactionHistory } from "./components/wallet/transaction-history";
import { WithdrawScreen } from "./components/wallet/withdraw-screen";
import { ProfileScreen } from "./components/profile/profile-screen";

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
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [walletBalance, setWalletBalance] = useState(5000);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john.doe@example.com',
    kycStatus: 'verified'
  });

  // Mock transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      amount: 1000,
      description: 'Money added via UPI',
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'add_money'
    },
    {
      id: '2',
      type: 'debit',
      amount: 500,
      description: 'Money sent to Jane Smith',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'completed',
      category: 'send_money',
      recipient: 'Jane Smith'
    },
    {
      id: '3',
      type: 'credit',
      amount: 2000,
      description: 'Money added via Card',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: 'completed',
      category: 'add_money'
    },
    {
      id: '4',
      type: 'debit',
      amount: 1500,
      description: 'Withdrawal to bank account',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: 'completed',
      category: 'withdraw'
    },
    {
      id: '5',
      type: 'credit',
      amount: 100,
      description: 'Cashback refund',
      timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      status: 'completed',
      category: 'refund'
    }
  ]);

  const handleLogin = (credentials: { phone?: string; email?: string; password: string }) => {
    // Mock login - in real app, this would authenticate with backend
    if (credentials.phone) {
      setUserInfo(prev => ({ ...prev, phone: credentials.phone! }));
    }
    if (credentials.email) {
      setUserInfo(prev => ({ ...prev, email: credentials.email! }));
    }
    
    // Check if KYC is completed
    if (userInfo.kycStatus === 'verified') {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('kyc');
    }
  };

  const handleSignup = (credentials: { phone?: string; email?: string; password: string; name: string }) => {
    // Mock signup - in real app, this would create account with backend
    setUserInfo({
      name: credentials.name,
      phone: credentials.phone || '',
      email: credentials.email || '',
      kycStatus: 'not_started'
    });
    setCurrentScreen('kyc');
  };

  const handleKYCComplete = () => {
    setUserInfo(prev => ({ ...prev, kycStatus: 'verified' }));
    setCurrentScreen('dashboard');
  };

  const handleAddMoneySuccess = (amount: number, method: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      description: `Money added via ${method}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'add_money'
    };
    
    setWalletBalance(prev => prev + amount);
    setTransactions(prev => [newTransaction, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handleSendMoneySuccess = (amount: number, recipient: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'debit',
      amount,
      description: `Money sent to ${recipient}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'send_money',
      recipient
    };
    
    setWalletBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handleWithdrawSuccess = (amount: number, account: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'debit',
      amount,
      description: `Withdrawal to ${account}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      category: 'withdraw'
    };
    
    setWalletBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setWalletBalance(5000);
    setTransactions([]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSignup={handleSignup}
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
            userName={userInfo.name}
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
            userInfo={userInfo}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="size-full">
      {renderScreen()}
    </div>
  );
}