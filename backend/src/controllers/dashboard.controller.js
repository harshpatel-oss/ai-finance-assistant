import { Income } from "../models/income.model.js";
import { Expense } from "../models/expense.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { isValidObjectId, Types } from "mongoose";


const getDashboardData = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //fetch total income
        const totalIncome =  await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // console.log("totalIncome:", {totalIncome , userId:isValidObjectId(userId)});

        //fetch total expense
        const totalExpense =  await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        //get income transaction in last 60 days
        const last60DaysTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //get total income in last 60 days
        const totalIncomeLast60Days = last60DaysTransactions.reduce((sum, income) => sum + income.amount, 0);

        //get expense transaction in last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });
        //get total expense in last 30 days
        const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce((sum, expense) => sum + expense.amount, 0);

       //fetch last 5 transactions (income + expense)
       const [incomeDocs, expenseDocs] = await Promise.all([
         Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean(),
         Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean()
       ]);

       const incomeWithType = incomeDocs.map(doc => ({ ...doc, type: 'income' }));
       const expenseWithType = expenseDocs.map(doc => ({ ...doc, type: 'expense' }));

       // combine both sets, sort by date desc and take top 5
       const last5Transactions = [...incomeWithType, ...expenseWithType]
         .sort((a, b) => new Date(b.date) - new Date(a.date))
         .slice(0, 5);
       
       //final response
       const incomeTotal = totalIncome[0]?.total || 0;
       const expenseTotal = totalExpense[0]?.total || 0;
       const totalBalance = incomeTotal - expenseTotal;

       return res
       .status(200)
       .json(new ApiResponse(200, {
        totalBalance,
        totalIncome: incomeTotal,
        totalExpense: expenseTotal,
        last30DaysExpenses:{
            total: totalExpenseLast30Days,
            transactions: last30DaysExpenseTransactions
        },
        last60DaysIncome:{
            total: totalIncomeLast60Days,
            transactions: last60DaysTransactions
        },
        recentTransactions:last5Transactions
       }, "Dashboard data fetched successfully"));  
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while fetching dashboard data");
    }
});

export {
    getDashboardData
};