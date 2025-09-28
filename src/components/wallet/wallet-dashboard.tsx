import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Plus,
  Send,
  History,
  ArrowDownToLine,
  Eye,
  EyeOff,
  User,
  Settings,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

interface WalletDashboardProps {
  balance: number;
  userName: string;
  onAddMoney: () => void;
  onSendMoney: () => void;
  onWithdraw: () => void;
  onTransactionHistory: () => void;
  onProfile: () => void;
  transactions: Transaction[];
}

export function WalletDashboard({
  balance,
  userName,
  onAddMoney,
  onSendMoney,
  onWithdraw,
  onTransactionHistory,
  onProfile,
  transactions,
}: WalletDashboardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const recentTransactions = transactions.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-4 bg-[#4A0E97]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="surface-primary rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-500 text-sm">
                Welcome back,
              </h1>
              <p className="text-xl text-slate-800 font-semibold">
                {userName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfile}
              className="text-slate-700 hover:bg-slate-200 rounded-xl"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="primary-gradient text-white border-0">
          <CardContent className="p-6 bg-[rgba(6,6,6,0.76)] rounded-[15px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <span className="text-white/90 font-medium">
                    Wallet Balance
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white bg-[#060606] hover:bg-white/10 rounded-xl"
                >
                  {showBalance ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold tracking-tight">
                  {showBalance
                    ? formatCurrency(balance)
                    : "••••••"}
                </div>
                <p className="text-white/80 text-sm font-medium">
                  Available to spend
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="surface-primary border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800 text-lg font-bold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={onAddMoney}
                className="h-24 flex-col gap-3 action-primary text-[rgba(6,6,6,0.82)] border-0 rounded-2xl bg-[#09092E]"
              >
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-white">
                  Add Money
                </span>
              </Button>
              <Button
                onClick={onSendMoney}
                className="h-24 flex-col gap-3 action-secondary text-white border-0 rounded-2xl bg-[rgba(0,0,0,0)]"
              >
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-white">
                  Send Money
                </span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={onWithdraw}
                className="h-24 flex-col gap-3 action-ghost text-slate-700 border-0 rounded-2xl"
              >
                <div className="p-3 surface-secondary rounded-xl">
                  <ArrowDownToLine className="h-6 w-6 text-slate-700" />
                </div>
                <span className="font-semibold text-slate-700">
                  Withdraw
                </span>
              </Button>
              <Button
                onClick={onTransactionHistory}
                className="h-24 flex-col gap-3 action-ghost text-slate-700 border-0 rounded-2xl"
              >
                <div className="p-3 surface-secondary rounded-xl">
                  <History className="h-6 w-6 text-slate-700" />
                </div>
                <span className="font-semibold text-slate-700">
                  History
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="surface-primary border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-slate-800 text-lg font-bold">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-slate-600">
                Your latest transactions
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onTransactionHistory}
              className="text-purple-600 hover:bg-purple-100 rounded-xl"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-purple-100 rounded-2xl w-fit mx-auto mb-4">
                  <History className="h-10 w-10 text-purple-600" />
                </div>
                <p className="text-slate-700 font-medium">
                  No transactions yet
                </p>
                <p className="text-sm text-slate-500">
                  Start by adding money to your wallet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map(
                  (transaction, index) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 surface-secondary rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-2xl ${
                            transaction.type === "credit"
                              ? "status-success"
                              : "status-error"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <TrendingDown className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 text-sm">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {formatTime(transaction.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-sm ${
                            transaction.type === "credit"
                              ? "text-accent-green"
                              : "text-accent-orange"
                          }`}
                        >
                          {transaction.type === "credit"
                            ? "+"
                            : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs mt-1 border-0 font-semibold ${
                            transaction.status === "completed"
                              ? "status-success"
                              : transaction.status === "pending"
                                ? "status-warning"
                                : "status-error"
                          }`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}