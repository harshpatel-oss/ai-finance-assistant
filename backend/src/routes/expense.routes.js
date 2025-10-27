import express from 'express';
import 
{   
    addExpense , 
    getAllExpenses , 
    deleteExpense ,
    downloadExpenseExcel
} 
from '../controllers/expense.controller.js';
import { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';    
const router = Router();

router.route('/add').post(verifyJWT , addExpense);
router.route('/get').get(verifyJWT , getAllExpenses);
router.route('/delete/:expenseId').delete(verifyJWT , deleteExpense);
router.route('/download-excel').get(verifyJWT , downloadExpenseExcel);

export default router;