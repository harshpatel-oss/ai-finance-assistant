import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.port || 8000 ,()=>{
        console.log(`Server is running at port : ${process.env.port}`);
    })
})
.catch((err)=>{
    console.log("MONGODB CONNECTION FAILED!!! :",err);
})