import express from 'express';
import 
{
    addIncome , 
    getAllIncome , 
    deleteIncome ,
    downloadIncomeExcel
} 
from '../controllers/income.controller.js';
import { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';    
const router = Router();


router.route('/add').post(verifyJWT , addIncome);
router.route('/get').get(verifyJWT , getAllIncome);
router.route('/delete/:incomeId').delete(verifyJWT , deleteIncome);
router.route('/download-excel').get(verifyJWT , downloadIncomeExcel);

export default router; 
