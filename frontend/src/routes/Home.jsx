import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader, CardSkeleton } from "../components/ui/Loader";
import { StatCard } from "../components/ui/StatCard";
import { RecentTransactions } from "../components/ui/Transactions";
import { Badge } from "../components/ui/Badge";

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      setData(res.data?.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
      let errorMessage = "Failed to load dashboard data";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Session expired. Please login again.";
          navigate("/login");
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = "Network error. Check your connection.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <Card className="border-2 border-red-100 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 text-center font-medium">{error}</p>
            <Button onClick={fetchDashboardData} className="mt-4 mx-auto" size="sm">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    totalIncome,
    totalExpense,
    totalBalance,
    last60DaysIncome,
    last30DaysExpenses,
    recentTransactions,
  } = data;

  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    : 0;

  // Prepare chart data
  const incomeTrendData = last60DaysIncome?.transactions?.slice(-30)?.map(tx => ({
    date: new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    value: tx.amount,
    fullDate: tx.date
  })) || [];

  const expenseTrendData = last30DaysExpenses?.transactions?.map(tx => ({
    date: new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    value: tx.amount,
    fullDate: tx.date
  })) || [];

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.username || "User"}! 👋
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Here's your financial overview for today</p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Add new transactions quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/income")}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Add Income
              </Button>
              <Button 
                onClick={() => navigate("/expense")}
                variant="danger"
                className="flex-1"
              >
                Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            label="Total Balance"
            value={totalBalance}
            prefix="₹"
            trend={savingsRate > 0 ? "up" : savingsRate < 0 ? "down" : null}
            isPositive={totalBalance >= 0}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Income"
            value={totalIncome}
            prefix="₹"
            trend={last60DaysIncome?.total > 0 ? "↑" : null}
            isPositive={true}
          />
          <StatCard
            icon={TrendingDown}
            label="Total Expense"
            value={totalExpense}
            prefix="₹"
            trend={last30DaysExpenses?.total > 0 ? "↓" : null}
            isPositive={false}
          />
          <StatCard
            icon={PieChartIcon}
            label="Savings Rate"
            value={savingsRate}
            suffix="%"
            trend={savingsRate > 30 ? "Good" : savingsRate > 10 ? "Fair" : "Low"}
            isPositive={savingsRate > 20}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income Trend Chart */}
          <Card hover={true}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" />
                Income Trend
              </CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {incomeTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={incomeTrendData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#f9fafb", 
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                      formatter={(value) => [`₹${value.toFixed(2)}`, "Income"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No income data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expense Trend Chart */}
          <Card hover={true}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown size={20} className="text-red-600" />
                Expense Trend
              </CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={expenseTrendData}>
                    <defs>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#f9fafb", 
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                      formatter={(value) => [`₹${value.toFixed(2)}`, "Expense"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorExpense)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Income vs Expense Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card hover={true} className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon size={20} className="text-indigo-600" />
                Distribution
              </CardTitle>
              <CardDescription>Income vs Expense</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <Card variant="gradient">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Monthly Income</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ₹{last60DaysIncome?.total?.toLocaleString() || "0"}
                  </p>
                </div>
                <Badge variant="success">This Month</Badge>
              </div>
            </Card>

            <Card variant="gradient">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ₹{last30DaysExpenses?.total?.toLocaleString() || "0"}
                  </p>
                </div>
                <Badge variant="warning">This Month</Badge>
              </div>
            </Card>

            <Card>
              <div>
                <p className="text-sm text-gray-600 font-medium">Average Daily</p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                  ₹{(last30DaysExpenses?.total / 30).toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Spend</p>
              </div>
            </Card>

            <Card>
              <div>
                <p className="text-sm text-gray-600 font-medium">Net Savings</p>
                <p className={`text-2xl font-bold mt-2 ${
                  (totalIncome - totalExpense) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  ₹{(totalIncome - totalExpense).toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">This Period</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <Card hover={true}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/expense")}
              className="flex items-center gap-2"
            >
              View All <ArrowRight size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions && recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.slice(0, 8).map((tx, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-full ${
                        tx.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {tx.type === "income" ? (
                          <ArrowDownLeft size={20} className="text-green-600" />
                        ) : (
                          <ArrowUpRight size={20} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {tx.source || tx.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No transactions yet</p>
                <Button 
                  onClick={() => navigate("/expense")}
                  className="mt-4"
                  size="sm"
                >
                  Add Transaction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
export default Home;
