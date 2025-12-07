import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";
import EmojiPicker from "emoji-picker-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { Trash2, Download, Plus } from "lucide-react";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "💸",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE);
      const expenseList = res.data;
      setExpenses(expenseList);
      prepareChartData(expenseList);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (expenseList) => {
    const groupedByDate = {};
    expenseList.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      if (!groupedByDate[date]) groupedByDate[date] = 0;
      groupedByDate[date] += expense.amount;
    });

    const data = Object.entries(groupedByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setChartData(data);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount || !formData.date) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        icon: formData.icon,
      });

      toast.success("Expense added successfully");
      setFormData({
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        icon: "💸",
      });
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Expense Excel downloaded successfully");
    } catch (error) {
      console.error("Error downloading excel:", error);
      toast.error("Failed to download excel");
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Expenses</h1>
        <p className="text-gray-600">Monitor and track your daily expenses</p>
      </div>

      <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-lg font-semibold opacity-90">Total Expense</h2>
        <p className="text-5xl font-bold mt-2">₹{totalExpense.toFixed(2)}</p>
        <p className="text-sm opacity-75 mt-2">
          Across {expenses.length} transactions
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
        >
          <Plus size={20} /> Add Expense
        </button>

        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
        >
          <Download size={20} /> Download Excel
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
          <form
            onSubmit={handleAddExpense}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleFormChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* ICON + EMOJI PICKER */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xl"
                >
                  😊
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute z-50 mt-2">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setFormData((prev) => ({
                        ...prev,
                        icon: emojiData.emoji,
                      }));
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Daily Expense Chart</h2>
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No expense data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="amount"
                fill="#ef4444"
                name="Expense Amount"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Expense Transactions</h2>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No expense transactions yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Icon
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4 text-center text-2xl">
                      {expense.icon}
                    </td>
                    <td className="px-4 py-4 text-gray-800 font-semibold">
                      {expense.category}
                    </td>
                    <td className="px-4 py-4 text-red-600 font-bold">
                      -₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() =>
                          handleDeleteExpense(expense._id)
                        }
                        className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;
