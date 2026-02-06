import { getFinanceResponse } from "../services/ai.service.js";

export const financeAssistantController = async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const response = await getFinanceResponse(query, context);

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate finance insights",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Finance Assistant Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
