import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Expense} from "../models/expense.model.js";
import xlsx from 'xlsx';

const addExpense = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            throw new ApiError(400, "category , amount and date are required");
        }
        const newExpense = await Expense.create({
            userId,
            icon,
            category,
            amount,
            date
        });         

        await newExpense.save();

        return res
            .status(201)
            .json(
                new ApiResponse(201, newExpense, "Expense added successfully")
            );

    } catch (error) {
        throw new ApiError(500 , "Something went wrong while adding expense");
    }
}); 


const getAllExpenses = asyncHandler(async (req, res) => {
    const userId = req.user._id;


    try {
        
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while fetching expenses");
    }

});

const deleteExpense = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        await Expense.findByIdAndDelete({
            _id: req.params.expenseId,
            userId: userId
        });
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while deleting expense");
    }
});

const downloadExpenseExcel = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        const data = expenses.map((expense) => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");
        xlsx.writeFile(wb, "expenses.xlsx");
        res.download("expenses.xlsx");

    } catch (error) {
        throw new ApiError(500 , "Something went wrong while downloading expenses");
    }

});

export { addExpense , getAllExpenses , deleteExpense , downloadExpenseExcel };