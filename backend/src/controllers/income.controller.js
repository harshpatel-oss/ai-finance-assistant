import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { Income } from '../models/income.model.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import xlsx from 'xlsx';
const addIncome = asyncHandler(async (req, res) => {
   //add Income logic here
    const userId = req.user._id;
    try {
       const { icon , source , amount , date} = req.body;

       if(!source || !amount || !date){
        throw new ApiError(400 , "source , amount and date are required");
       }

       const newIncome = await Income.create({
        userId,
        icon,
        source,
        amount,
        date
       });

       await newIncome.save();

       return res
       .status(201)
       .json(
        new ApiResponse(201 , newIncome , "Income added successfully")
       );
    } catch (err) {
        throw new ApiError(500 , "Something went wrong while adding income");
    }

});

const getAllIncome = asyncHandler(async (req, res) => {
   const userId = req.user._id;

    try {
        const incomes = await Income.find({userId}).sort({date:-1});
        res.json(incomes);
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while fetching incomes");
    }

});

const deleteIncome = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
         await Income.findByIdAndDelete({
            _id : req.params.incomeId,
            userId : userId
         });
         res.json({message : "Income deleted successfully"});
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while deleting income");
        
    }
});

const downloadIncomeExcel = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await Income.find({userId}).sort({date:-1});

        //prepare data for excel 
        const data = incomes.map((income) => ({
            Source : income.source,
            Amount : income.amount,
            Date : income.date.toDateString(),
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb , ws , 'Incomes');
        xlsx.writeFile(wb , 'incomes.xlsx');
        res.download('incomes.xlsx' , 'incomes.xlsx' , (err) => {
            if(err){
                throw new ApiError(500 , "Something went wrong while downloading income excel");
            }
        });

    } catch (error) {
        throw new ApiError(500 , "Something went wrong while downloading income excel");
    }
});

 export {addIncome , getAllIncome , deleteIncome , downloadIncomeExcel};

    