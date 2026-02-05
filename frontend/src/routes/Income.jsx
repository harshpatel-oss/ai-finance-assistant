import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";
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
import EmojiPicker from "emoji-picker-react"; // ⬅️ Added Emoji Picker

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [chartData, setChartData] = useState([]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "💰",
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.INCOME.GET_INCOME);
      const incomeList = res.data;
      setIncomes(incomeList);
      prepareChartData(incomeList);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      toast.error("Failed to fetch incomes");
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (incomeList) => {
    const groupedByDate = {};
    incomeList.forEach((income) => {
      const date = new Date(income.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      if (!groupedByDate[date]) groupedByDate[date] = 0;
      groupedByDate[date] += income.amount;
    });

    const data = Object.entries(groupedByDate)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
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

  const onEmojiClick = (emojiData) => {
    setFormData((prev) => ({
      ...prev,
      icon: emojiData.emoji,
    }));
    setShowEmojiPicker(false);
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();

    if (!formData.source || !formData.amount || !formData.date) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source: formData.source,
        amount: parseFloat(formData.amount),
        date: formData.date,
        icon: formData.icon,
      });

      toast.success("Income added successfully");
      setFormData({
        source: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        icon: "💰",
      });
      setShowForm(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error(error.response?.data?.message || "Failed to add income");
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
      toast.success("Income deleted successfully");
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "incomes.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      toast.success("Income Excel downloaded successfully");
    } catch (error) {
      console.error("Error downloading excel:", error);
      toast.error("Failed to download excel");
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Income</h1>
        <p className="text-gray-600">Track and manage all your income sources</p>
      </div>

      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-lg font-semibold opacity-90">Total Income</h2>
        <p className="text-5xl font-bold mt-2">₹{totalIncome.toFixed(2)}</p>
        <p className="text-sm opacity-75 mt-2">Across {incomes.length} transactions</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
        >
          <Plus size={20} />
          Add Income
        </button>

        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
        >
          <Download size={20} />
          Download Excel
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Income</h2>
          <form onSubmit={handleAddIncome} className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Source
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleFormChange}
                placeholder="e.g., Salary, Freelance"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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
                placeholder="Enter amount"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Emoji Picker Integration */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icon
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xl text-center cursor-pointer"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="px-3 py-2 border text-xl bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  🙂
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute z-20 bg-white shadow-lg rounded-lg p-2 top-16 right-0">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>

            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-semibold"
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

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Daily Income Chart</h2>
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No income data available</p>
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
                fill="#22c55e"
                name="Income Amount"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Income Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Income Transactions</h2>

        {incomes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No income transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Icon
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Source
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
                {incomes.map((income) => (
                  <tr key={income._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-center text-2xl">{income.icon}</td>
                    <td className="px-4 py-4 text-gray-800 font-semibold">{income.source}</td>
                    <td className="px-4 py-4 text-green-600 font-bold">
                      +₹{income.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {new Date(income.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleDeleteIncome(income._id)}
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

export default Income;
