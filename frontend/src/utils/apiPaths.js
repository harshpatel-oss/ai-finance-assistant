export const  API_BASE_URL = import.meta.env.VITE_API_URL ;
//export const  API_BASE_URL =  "http://localhost:8000";
export const API_PATHS = {
    AUTH:{
        LOGIN:"/api/v1/users/login",
        REGISTER:"/api/v1/users/register",
        LOGOUT:"/api/v1/users/logout",
        REFRESH_TOKEN:"/api/v1/users/refresh-token",
        GET_USER_INFO:"/api/v1/users/current-user"
    },
    USER:{
        GET_PROFILE:"/api/v1/users/profile",
        UPDATE_PROFILE:"/api/v1/users/update-profile"
    },
    DASHBOARD:{
        GET_DATA:"/api/v1/dashboard"
    },
    INCOME:{
        ADD_INCOME:"/api/v1/income/add",
        GET_INCOME:"/api/v1/income/get",
        DELETE_INCOME : (incomeId) => `/api/v1/income/delete/${incomeId}`,
        DOWNLOAD_INCOME:"/api/v1/income/download-excel"
    },
    EXPENSE:{
        ADD_EXPENSE:"/api/v1/expense/add",
        GET_EXPENSE:"/api/v1/expense/get",
        DELETE_EXPENSE : (expenseId) => `/api/v1/expense/delete/${expenseId}`,
        DOWNLOAD_EXPENSE:"/api/v1/expense/download-excel"
    },
    AI:{
        AI_ASSISTANT:"/api/v1/ai/ai-assistant"
    }

}
    