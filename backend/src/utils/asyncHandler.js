const asyncHandler = (requestHandler)=>{
   return (req ,res , next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))  //ye next express ka hi function hai jo error handling k liye use hota hai
     }
}

// const asyncHandler= (fn) => async (req , res ,next) =>{
//     try{
//             await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message || "Internal Server Error"
//         })
//     }
// }

// dono tarike se kaam kar sakte haen hum

export {asyncHandler}

