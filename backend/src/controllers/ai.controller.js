import { getFinanceResponse } from "../services/ai.service.js";
import { Expense } from "../models/expense.model.js";
import { Income } from "../models/income.model.js";

export const financeAssistantController = async (req, res) => {
  try {
    let { query } = req.body;
    const userId = req.user?._id;

    // VALIDATION
    if (!query?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    query = query.trim();

    console.log("User ID:", userId);

    // 🔍 FETCH DATA (SAFE QUERY)
    const [expenses, incomes] = await Promise.all([
      Expense.find({
        $or: [
          { user: userId },
          { userId: userId },
          { user: userId.toString() },
          { userId: userId.toString() },
        ],
      })
        .sort({ date: -1 })
        .limit(50),

      Income.find({
        $or: [
          { user: userId },
          { userId: userId },
          { user: userId.toString() },
          { userId: userId.toString() },
        ],
      })
        .sort({ date: -1 })
        .limit(50),
    ]);

    // 🔍 DEBUG
    console.log("Expenses from DB:", expenses.length);
    console.log("Incomes from DB:", incomes.length);

    //  HANDLE NO DATA
    if (!expenses.length && !incomes.length) {
      return res.status(200).json({
        success: true,
        response: `
📊 No financial data found.

Please add:
- Income entries
- Expense records

Then I can analyze your finances.
`,
      });
    }

    //  BUILD CONTEXT
    const context = {
      expenses: expenses.map((e) => ({
        amount: Number(e.amount) || 0,
        category: e.category || "Other",
        date: e.date || new Date(),
      })),
      incomes: incomes.map((i) => ({
        amount: Number(i.amount) || 0,
        source: i.source || "Unknown",
        date: i.date || new Date(),
      })),
    };

    console.log("Context sent to AI:", context);

    // CALL AI (WITH FALLBACK)
    let aiResponse;

    try {
      aiResponse = await getFinanceResponse(query, context);
    } catch (err) {
      console.error("AI Error:", err);

      //  fallback if AI fails (rate limit etc.)
      const totalIncome = context.incomes.reduce((s, i) => s + i.amount, 0);
      const totalExpense = context.expenses.reduce((s, e) => s + e.amount, 0);
      const balance = totalIncome - totalExpense;

      aiResponse = `
📊 Basic Financial Summary:

- Income: ₹${totalIncome}
- Expense: ₹${totalExpense}
- Balance: ₹${balance}

⚠️ AI service temporarily unavailable.
`;
    }

    //  RESPONSE
    return res.status(200).json({
      success: true,
      response: aiResponse,
    });

  } catch (error) {
    console.error("Finance Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};