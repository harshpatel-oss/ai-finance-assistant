import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export const TransactionItem = ({ transaction, type = "expense" }) => {
  const isIncome = type === "income";
  const isExpense = type === "expense";

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${
          isIncome ? "bg-green-100" : "bg-red-100"
        }`}>
          {isIncome ? (
            <ArrowDownLeft size={20} className="text-green-600" />
          ) : (
            <ArrowUpRight size={20} className="text-red-600" />
          )}
        </div>

        <div>
          <p className="font-medium text-gray-900">
            {transaction.category || "Uncategorized"}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className={`font-semibold ${
        isIncome ? "text-green-600" : "text-red-600"
      }`}>
        {isIncome ? "+" : "-"}₹{transaction.amount?.toLocaleString()}
      </p>
    </div>
  );
};

export const RecentTransactions = ({ transactions = [], loading = false, type = "expense" }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest {type}s</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((transaction, idx) => (
            <TransactionItem 
              key={idx} 
              transaction={transaction}
              type={type}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
