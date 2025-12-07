import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!data) return <div className="text-center mt-20">No data available</div>;

  const {
    totalIncome,
    totalExpense,
    totalBalance,
    last60DaysIncome,
    last30DaysExpenses,
    recentTransactions,
  } = data;

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
    { name: "Balance", value: totalBalance },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Income" amount={totalIncome} color="green" icon="📈" />
        <StatCard title="Total Expense" amount={totalExpense} color="red" icon="📉" />
        <StatCard title="Total Balance" amount={totalBalance} color="blue" icon="💰" />
      </div>

      {/* FINANCIAL OVERVIEW & RECENT TRANSACTIONS SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PIE CHART - FINANCIAL OVERVIEW */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT TRANSACTIONS - SHOW ONLY 10 */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          <TransactionList transactions={recentTransactions.slice(0, 10)} />
          
          {recentTransactions.length > 10 && (
            <button 
              onClick={() => navigate("/income")}
              className="text-blue-500 underline mt-4 text-sm font-semibold hover:text-blue-700"
            >
              See All →
            </button>
          )}
        </div>

      </div>

      {/* LAST 60 DAYS INCOME & LAST 30 DAYS EXPENSE SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LAST 60 DAYS INCOME */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Last 60 Days Income</h2>
            <span className="font-semibold text-green-600">
              ₹{last60DaysIncome.total.toFixed(2)}
            </span>
          </div>

          <CustomLineChart
            transactions={last60DaysIncome.transactions}
            color="green"
          />

          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Income Transactions</h3>
            {last60DaysIncome.transactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No income transactions</p>
            ) : (
              last60DaysIncome.transactions.slice(0, 5).map((tx) => (
                <div key={tx._id} className="flex justify-between text-sm p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tx.icon}</span>
                    <div>
                      <p className="font-semibold">{tx.source}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold">+₹{tx.amount.toFixed(2)}</span>
                </div>
              ))
            )
            }
          </div>

          <button 
            onClick={() => navigate("/income")}
            className="text-blue-500 underline mt-3 text-sm font-semibold hover:text-blue-700"
          >
            See More →
          </button>
        </div>

        {/* LAST 30 DAYS EXPENSE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Last 30 Days Expense</h2>
              <span className="font-semibold text-red-600">
                ₹{last30DaysExpenses.total.toFixed(2)}
              </span>
            </div>

            <CustomLineChart
              transactions={last30DaysExpenses.transactions}
              color="red"
            />

            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Expense Transactions</h3>
              {last30DaysExpenses.transactions.length === 0 ? (
                <p className="text-gray-500 text-sm">No expense transactions</p>
            ) : (
              last30DaysExpenses.transactions.slice(0, 5).map((tx) => (
                <div key={tx._id} className="flex justify-between text-sm p-2 bg-red-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tx.icon}</span>
                    <div>
                      <p className="font-semibold">{tx.category}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <span className="text-red-600 font-bold">-₹{tx.amount.toFixed(2)}</span>
                </div>
              ))
            )}
                    </div>
        
                    <button 
                      onClick={() => navigate("/expense")}
                      className="text-blue-500 underline mt-3 text-sm font-semibold hover:text-blue-700"
                    >
                      See More →
                    </button>
                  </div>
        
              </div>
        
            </div>
          );
        }

/* ======================== COMPONENTS ======================== */

function StatCard({ title, amount, color, icon }) {
  const colorMap = {
    green: "border-green-500 text-green-700",
    red: "border-red-500 text-red-700",
    blue: "border-blue-500 text-blue-700",
  };

  return (
    <div className={`p-6 border-l-4 ${colorMap[color]} bg-white rounded-xl shadow`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold">₹{amount.toFixed(2)}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function TransactionList({ transactions }) {
  if (!transactions || transactions.length === 0)
    return <div className="text-gray-500 text-sm">No transactions yet.</div>;

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {transactions.map((tx) => (
        <div key={tx._id} className="flex justify-between p-3 bg-gray-100 rounded hover:bg-gray-150 transition">
          <div className="flex items-center gap-2">
            <span className="text-lg">{tx.icon}</span>
            <div>
              <p className="font-semibold text-sm">{tx.source || tx.category}</p>
              <p className="text-xs text-gray-500">
                {new Date(tx.date).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <span
            className={`font-bold text-sm ${
              tx.type === "income" ? "text-green-600" : "text-red-600"
            }`}
          >
            {tx.type === "income" ? "+" : "-"}₹{tx.amount.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLineChart({ transactions, color }) {
  if (!transactions || !transactions.length) 
    return <div className="text-gray-500 text-sm py-8 text-center">No data</div>;

  const maxVal = Math.max(...transactions.map((t) => t.amount), 1);

  return (
    <div className="flex gap-1 h-32 items-end px-2 bg-gray-50 rounded p-2">
      {transactions.slice(0, 10).map((tx) => (
        <div key={tx._id} className="flex flex-col items-center flex-1 text-xs">
          <div
            className={`w-full rounded-t transition-all hover:opacity-80 ${
              color === "green" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ height: `${(tx.amount / maxVal) * 100}%`, minHeight: "8px" }}
            title={`₹${tx.amount.toFixed(2)}`}
          ></div>
          <p className="text-gray-500 mt-1 text-center">
            {new Date(tx.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Home;
