import express from "express"
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({ extended: true ,limit:'16kb'}));
app.use(express.static('public'));
app.use(cookieParser());
//cookie parser middleware lagaya ab hum cookies ko read kr payenge

//routes import

import userRouter from './routes/user.routes.js';
import incomeRouter from './routes/income.routes.js';
import expenseRouter from './routes/expense.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

app.use('/api/v1/users' , userRouter);
app.use('/api/v1/income',incomeRouter)  
app.use('/api/v1/expense',expenseRouter);   
app.use('/api/v1/dashboard',dashboardRouter);

export default app;

