import mongoose ,{Schema} from "mongoose";

const incomeSchema = new Schema({
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
     },
     icon:{
        type:String,
     },
     source:{
        type:String,
        required:true,
     },
     amount:{
        type:Number,
        required:true,
     },
    date:{
    type:Date,
     default:Date.now,
     },
    },{
        timestamps:true
    });


export const Income = mongoose.model('Income' , incomeSchema);