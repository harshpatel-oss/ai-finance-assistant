import React, { useEffect, useState, useRef } from "react";
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
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Trash2, Download, Plus, TrendingDown, Filter, Search, Smile } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useToast, ToastContainer } from "../components/ui/Toast";
import { Loader, CardSkeleton } from "../components/ui/Loader";
import { Badge } from "../components/ui/Badge";
import EmojiPicker from 'emoji-picker-react';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { toasts, showToast } = useToast();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "💸",
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE);
      const expenseList = res.data;
      setExpenses(expenseList);
      prepareChartData(expenseList);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      showToast("Failed to fetch expenses", "error");
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
      });
      if (!groupedByDate[date]) groupedByDate[date] = 0;
      groupedByDate[date] += expense.amount;
    });

    const data = Object.entries(groupedByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14);

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
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      setSubmitLoading(true);
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        icon: formData.icon,
      });

      showToast("Expense added successfully!", "success");
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
      showToast(error.response?.data?.message || "Failed to add expense", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
      showToast("Expense deleted successfully", "success");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      showToast("Failed to delete expense", "error");
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
      link.setAttribute("download", `expenses-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast("Expense Excel downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading excel:", error);
      showToast("Failed to download excel", "error");
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount?.toString().includes(searchTerm);
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(expenses.map((e) => e.category))];

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            💸 Expenses
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Track and manage your spending</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover className="border-2 border-red-100 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    ₹{totalExpense.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {expenses.length} transactions
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown size={28} className="text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">Average Expense</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  ₹{avgExpense.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Per transaction</p>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">This Month</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {expenses.length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Transactions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Expense
          </Button>

          <Button
            onClick={handleDownloadExcel}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download size={20} />
            Download Excel
          </Button>
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Add New Expense"
          size="lg"
        >
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                placeholder="e.g., Food, Transport"
                required
              />

              <Input
                label="Amount (₹)"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleFormChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                required
              />

              <div className="relative">
                <Input
                  label="Icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleFormChange}
                  placeholder="💸"
                  maxLength="2"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-9 p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Smile size={20} className="text-gray-500" />
                </button>
                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute top-full mt-2 z-50">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setFormData(prev => ({ ...prev, icon: emojiData.emoji }));
                        setShowEmojiPicker(false);
                      }}
                      theme="light"
                      width={300}
                      height={400}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={submitLoading} size="full">
                Add Expense
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="full"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card hover>
            <CardHeader>
              <CardTitle>Expense Trend</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => `₹${value.toFixed(2)}`}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#ef4444"
                      name="Expense"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card hover>
            <CardHeader>
              <CardTitle>By Category</CardTitle>
              <CardDescription>Expense distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const catTotal = expenses
                      .filter((e) => e.category === cat)
                      .reduce((sum, e) => sum + e.amount, 0);
                    const percentage = (catTotal / totalExpense) * 100;

                    return (
                      <div key={cat}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {cat}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            ₹{catTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No data</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>
                Showing {filteredExpenses.length} of {expenses.length} expenses
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Search by category or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                containerClassName="w-full"
              />
              <Select
                options={[
                  { label: "All Categories", value: "" },
                  ...categories.map((cat) => ({ label: cat, value: cat })),
                ]}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
               containerClassName="w-full"
              />
            </div>

            {/* Expenses List */}
            {filteredExpenses.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExpenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{expense.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {expense.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(expense.date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-red-600 text-lg">
                        -₹{expense.amount.toLocaleString()}
                      </p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No expenses found</p>
                <Button onClick={() => setShowForm(true)} size="sm">
                  Add Your First Expense
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default Expense;
