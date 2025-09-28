import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Calendar,
  RefreshCw
} from "lucide-react";

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

interface TransactionHistoryProps {
  onBack: () => void;
  transactions: Transaction[];
}

export function TransactionHistory({ onBack, transactions }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'add_money': return 'Money Added';
      case 'send_money': return 'Money Sent';
      case 'withdraw': return 'Withdrawal';
      case 'refund': return 'Refund';
      default: return category;
    }
  };

  const getTransactionIcon = (type: string, category: string) => {
    if (type === 'credit') {
      return <TrendingUp className="h-4 w-4" />;
    } else {
      return <TrendingDown className="h-4 w-4" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    
    let matchesDate = true;
    if (dateRange !== "all") {
      const transactionDate = new Date(transaction.timestamp);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const getDateGroupLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="min-h-screen p-4 bg-[rgba(9,9,46,1)]">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
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
              <div className="flex-1">
                <CardTitle className="gradient-text text-xl font-bold">Transaction History</CardTitle>
                <CardDescription className="text-slate-600">All your wallet transactions</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="glass-card hover:scale-105 transition-transform rounded-xl"
              >
                <Download className="h-4 w-4 text-indigo-600" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card className="glass-card border-0 card-hover">
          <CardContent className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {Object.keys(groupedTransactions).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No transactions found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedTransactions)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, dateTransactions]) => (
                <Card key={date}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm">{getDateGroupLabel(date)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {dateTransactions
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                transaction.type === 'credit' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {getTransactionIcon(transaction.type, transaction.category)}
                              </div>
                              <div>
                                <p className="text-sm">{transaction.description}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(transaction.timestamp)}
                                  </p>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs px-1 py-0"
                                  >
                                    {getCategoryLabel(transaction.category)}
                                  </Badge>
                                </div>
                                {transaction.recipient && (
                                  <p className="text-xs text-muted-foreground">
                                    To: {transaction.recipient}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm ${
                                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </p>
                              <Badge 
                                variant={transaction.status === 'completed' ? 'default' : 
                                        transaction.status === 'pending' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  );
}