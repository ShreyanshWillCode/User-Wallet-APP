import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { walletAPI, transactionsAPI } from '../services/api';
import { 
  Plus, 
  Send, 
  Download, 
  History, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();

  // Fetch wallet balance
  const { data: balanceData, isLoading: balanceLoading } = useQuery(
    'wallet-balance',
    walletAPI.getBalance,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Fetch recent transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery(
    'recent-transactions',
    () => transactionsAPI.getTransactions({ limit: 5 }),
    {
      refetchInterval: 30000,
    }
  );

  // Fetch transaction stats
  const { data: statsData } = useQuery(
    'transaction-stats',
    () => transactionsAPI.getStats('30d')
  );

  const balance = balanceData?.data?.balance || 0;
  const transactions = transactionsData?.data?.transactions || [];
  const stats = statsData?.data?.summary || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (type, direction) => {
    if (type === 'add_money') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (type === 'withdraw') return <TrendingDown className="h-5 w-5 text-red-500" />;
    if (direction === 'credit') return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    return <ArrowUpRight className="h-5 w-5 text-red-500" />;
  };

  const getTransactionColor = (direction) => {
    return direction === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  if (balanceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your wallet today.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">Total Balance</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>
            <p className="text-primary-100 text-sm mt-1">
              {user?.kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
            </p>
          </div>
          <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/add-money"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Add Money</h3>
              <p className="text-sm text-gray-500">Top up your wallet</p>
            </div>
          </div>
        </Link>

        <Link
          to="/send-money"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Send Money</h3>
              <p className="text-sm text-gray-500">Transfer to others</p>
            </div>
          </div>
        </Link>

        <Link
          to="/withdraw"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Withdraw</h3>
              <p className="text-sm text-gray-500">Send to bank</p>
            </div>
          </div>
        </Link>

        <Link
          to="/transactions"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <History className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">History</h3>
              <p className="text-sm text-gray-500">View transactions</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            This Month
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Money Received</p>
                  <p className="text-sm text-gray-500">
                    {stats.totalReceived ? formatCurrency(stats.totalReceived) : '₹0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Money Sent</p>
                  <p className="text-sm text-gray-500">
                    {stats.totalSent ? formatCurrency(stats.totalSent) : '₹0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <History className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Total Transactions</p>
                  <p className="text-sm text-gray-500">
                    {stats.totalTransactions || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <Link
              to="/transactions"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>

          {transactionsLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getTransactionIcon(transaction.type, transaction.direction)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getTransactionColor(transaction.direction)}`}>
                      {transaction.direction === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
