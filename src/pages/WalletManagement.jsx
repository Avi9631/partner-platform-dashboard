import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Wallet,
  Plus,
  Calendar,
  FileText,
  AlertCircle,
  RefreshCw,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { walletApi } from "@/services/walletService";

// Stats Card Component
function StatsCard({ icon, value, label, color }) {
  const colorClasses = {
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/20',
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    green: 'from-green-500 to-green-600 shadow-green-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6 shadow-lg relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
        <div className="text-8xl">{icon}</div>
      </div>
      <div className="relative z-10">
        <div className="mb-2">{icon}</div>
        <div className="text-3xl font-extrabold mb-1">{value}</div>
        <div className="text-sm font-medium opacity-90">{label}</div>
      </div>
    </motion.div>
  );
}

export default function WalletManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactionType, setTransactionType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch wallet balance
  const fetchBalance = async () => {
    try {
      const response = await walletApi.getBalance();
      setBalance(response.data?.balance ?? 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet balance",
        variant: "destructive",
      });
    }
  };

  // Fetch transactions
  const fetchTransactions = async (currentPage = 1, resetPage = false) => {
    try {
      setLoading(true);
      
      const params = {
        page: resetPage ? 1 : currentPage,
        limit: pageSize,
      };
      
      if (transactionType !== "all") {
        params.transactionType = transactionType.toUpperCase();
      }
      
      if (startDate) {
        params.startDate = startDate;
      }
      
      if (endDate) {
        params.endDate = endDate;
      }
      
      const response = await walletApi.getTransactions(params);
      setTransactions(response.data?.transactions || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalTransactions(response.data?.total || 0);
      setPage(resetPage ? 1 : currentPage);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setTransactionType("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Apply filters
  const applyFilters = () => {
    fetchTransactions(1, true);
  };

  // Handle recharge
  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setRechargeLoading(true);
      await walletApi.recharge(amount);
      toast({
        title: "Success",
        description: "Wallet recharged successfully!",
      });
      setRechargeDialogOpen(false);
      setRechargeAmount("");
      // Refresh balance and transactions
      fetchBalance();
      fetchTransactions(page);
    } catch (error) {
      console.error("Error recharging wallet:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to recharge wallet",
        variant: "destructive",
      });
    } finally {
      setRechargeLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [authLoading, user]);

  // Refetch when filters change
  useEffect(() => {
    if (!authLoading && user) {
      fetchTransactions(page);
    }
  }, [pageSize]);

  const getTransactionBadge = (type) => {
    const lowerType = type?.toLowerCase();
    return lowerType === "credit" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <ArrowUpRight className="h-3 w-3 mr-1" />
        Credit
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <ArrowDownRight className="h-3 w-3 mr-1" />
        Debit
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Wallet Management</h1>
              <p className="text-orange-100 text-sm md:text-base">Manage your wallet and view transaction history</p>
            </div>
            <Button
              size="lg"
              onClick={() => setRechargeDialogOpen(true)}
              className="h-12 px-8 text-sm font-bold bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:scale-105 transition-all duration-300 self-start md:self-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Recharge Wallet
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<Wallet className="w-6 h-6" />}
            value={balance !== null ? balance.toFixed(2) : "0.00"}
            label="Current Balance"
            color="orange"
          />
          <StatsCard
            icon={<FileText className="w-6 h-6" />}
            value={totalTransactions}
            label="Total Transactions"
            color="blue"
          />
          <StatsCard
            icon={<ArrowUpRight className="w-6 h-6" />}
            value={transactions.filter(t => t.transactionType?.toLowerCase() === 'credit').length}
            label="Funds Received"
            color="green"
          />
          <StatsCard
            icon={<ArrowDownRight className="w-6 h-6" />}
            value={transactions.filter(t => t.transactionType?.toLowerCase() === 'debit').length}
            label="Funds Used"
            color="purple"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Card className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Transaction Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="type-filter">Transaction Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit Only</SelectItem>
                  <SelectItem value="debit">Debit Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Apply Button */}
            <div className="space-y-2">
              <Label className="invisible">Apply</Label>
              <Button 
                onClick={applyFilters} 
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="  mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {totalTransactions > 0 
                  ? `Showing ${((page - 1) * pageSize) + 1}-${Math.min(page * pageSize, totalTransactions)} of ${totalTransactions} transactions`
                  : "No transactions found"
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(parseInt(val))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTransactions(page)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-6">
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {transactionType !== "all" || startDate || endDate
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Start by recharging your wallet to see your transaction history."}
              </p>
              {!(transactionType !== "all" || startDate || endDate) && (
                <Button
                  size="lg"
                  onClick={() => setRechargeDialogOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Recharge Now
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Date & Time</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead className="w-[120px]">Amount</TableHead>
                      <TableHead className="min-w-[200px]">Description</TableHead>
                      <TableHead className="w-[150px]">Reference</TableHead>
                      <TableHead className="w-[120px] text-right">Balance After</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.transactionId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">
                              {formatDate(transaction.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTransactionBadge(transaction.transactionType?.toLowerCase())}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold text-base ${
                              transaction.transactionType?.toLowerCase() === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.transactionType?.toLowerCase() === "credit" ? "+" : "-"}
                            {transaction.amount?.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm break-words">
                              {transaction.reason || transaction.note || "No description"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{transaction.referenceType || "N/A"}</div>
                            {transaction.referenceId && (
                              <div className="text-xs text-muted-foreground">
                                #{transaction.referenceId}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className="text-base">
                            {transaction.balanceAfter?.toFixed(2) || "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTransactions(1)}
                      disabled={page === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTransactions(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = idx + 1;
                        } else if (page <= 3) {
                          pageNum = idx + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + idx;
                        } else {
                          pageNum = page - 2 + idx;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => fetchTransactions(pageNum)}
                            className={page === pageNum ? "bg-orange-600 hover:bg-orange-700" : ""}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTransactions(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTransactions(totalPages)}
                      disabled={page === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        </Card>
      </div>

      {/* Recharge Dialog */}
      <Dialog open={rechargeDialogOpen} onOpenChange={setRechargeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Recharge Wallet
            </DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet balance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Funds)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <Label>Quick Select</Label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setRechargeAmount(amount.toString())}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>

            {rechargeAmount && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-muted-foreground mb-1">
                  You will receive:
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {parseFloat(rechargeAmount).toFixed(2)} Funds
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRechargeDialogOpen(false);
                setRechargeAmount("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecharge}
              disabled={rechargeLoading || !rechargeAmount}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {rechargeLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Recharge Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
