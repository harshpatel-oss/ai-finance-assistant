import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';  
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) =>{
  try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;// sirf refresh token ko hi db me store karna hai
    await user.save({validateBeforeSave:false});
    return {accessToken , refreshToken };
  }
  catch(error){
    throw new ApiError(500 , 'Something went wrong while generating refresh and access tokens');
  }
}

const registerUser = asyncHandler(async (req, res) => {
    //steps to register a user ->
      const { email ,username , password, fullName } = req.body;

      if(
            [ email ,username , password, fullName].some((field)=>field?.trim() === '')
        ){
             throw new ApiError(400 , 'username, email, password, and full name are required');
        }

      const existedUser = await User.findOne({
         $or:[{username} , {email}]
       });

       if(existedUser){
        throw new ApiError(409 , 'User already exists with this email or username');
         }

        const avatarLocalPath = req.file?.path; 
     
        if(!avatarLocalPath){
          throw new ApiError(400, "Avatar file missing");
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath);
    
        if(!avatar){
            throw new ApiError(500 , 'Avatar upload failed, please try again');
        }

        const user = await User.create({
            avatar: avatar.secure_url || avatar.url,
            email,
            username : username.toLowerCase(),
            fullName,
            password
        });

       const createdUser = await User.findById(user._id).select(
        "-password -refreshToken "
          );

        if(!createdUser){
        throw new ApiError(500 , 'Something went erong while registering user');
         }

         // Generate tokens after user creation
         const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id);

         return res.status(201).json(// yaha 201 status code dena jaruri nahi hai but best practice hai
            new ApiResponse(201 , { user: createdUser, accessToken, refreshToken } , 'User registered successfully') //status code ,data , message
         );


});

const loginUser = asyncHandler(async (req, res) => {
   
    // console.log(req.body);
    const {email ,username , password} = req.body;

    if(!username && !email){
        throw new ApiError(400 , "Username or email is required to login");
    }

    const user = await User.findOne({
        $or:[
            {username}, 
            {email}
        ]
    });

    if(!user){
        throw new ApiError(404 , "User not found, please register");
    }   

    const isPasswordValid = await user.isPasswordCorrect(password); //ye method maine user model me banaya hai
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid user credentials");
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken "
          );

       const options = {
         httpOnly:true,
         secure:process.env.NODE_ENV === "production",
         sameSite:process.env.NODE_ENV === "production" ? "None":"Lax",
       }
        return res
        .status(200)
        .cookie('accessToken' , accessToken , options)
        .cookie('refreshToken' , refreshToken , options)
        .json(
            new ApiResponse(
                200 ,
                {user:loggedInUser , accessToken , refreshToken} ,
                'User logged in successfully'
                )
            //access token and refresh token is also sent in response body for client side storage if needed acchhi practice hai
        );


}); 

const logoutUser = asyncHandler(async (req, res) => {
    
    //req.user is set in verifyJWT middleware
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
                //1 means true
            }
        },
        {
            new:true
        }
    );
     const options = {
         httpOnly:true,
         secure:process.env.NODE_ENV === "production",
         sameSite:process.env.NODE_ENV === "production" ? "None":"Lax",
       }
    return res
    .status(200)
    .clearCookie("accessToken",options) //cookie ko expire krdo
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200 , {} , "User logged out successfully")
    );  

});
const refreshAccessToken = asyncHandler(async (req, res) => {
    
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken ;
    console.log(req.cookies?.refreshToken);
    console.log('--------');
    console.log( req.body?.refreshToken);
    if(!incomingRefreshToken){
        throw new ApiError(401 , "Unauthorized request");
    }

   try {
    const decodedToken =  jwt.verify(
         incomingRefreshToken, 
         process.env.REFRESH_TOKEN_SECRET , 
         )
 
     const user = await User.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(401 , "Invalid refresh token");
     }
 
     if(user.refreshToken !== incomingRefreshToken){
         throw new ApiError(401 , "Refresh token mismatch, login again");
     }
 
     const options = {
         httpOnly:true,
         secure:process.env.NODE_ENV === "production",
         sameSite:process.env.NODE_ENV === "production" ? "None":"Lax",
       }
 
    const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken,
            },
            "Access token refreshed successfully"
        )
    );
   } 
   catch (error) 
   {
    throw new ApiError(401 , error.message || "Invalid refresh token");
   }

    
});
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200 , req.user , "Current user fetched successfully")
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    //update profile logic
    const { username, email, fullName } = req.body;
    const updatedData = {};

    if(fullName?.trim() === ''){
        throw new ApiError(400 , "Full name cannot be empty");
    }
    if(username?.trim() === ''){
        throw new ApiError(400 , "Username cannot be empty");
    }
    if(email?.trim() === ''){
        throw new ApiError(400 , "Email cannot be empty");
    }

    const existingUser = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email }
        ],
        _id: { $ne: req.user._id }
    });

    if (existingUser) {
        throw new ApiError(409, 'Username or email already in use by another account');
    }

    const avatarLocalPath = req.file?.path;
    
    if(avatarLocalPath){
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if(!avatar){
            throw new ApiError(500 , 'Avatar upload failed, please try again');
        }
        updatedData.avatar = avatar.secure_url || avatar.url;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                username:username.toLowerCase(),
                email:email,  
                fullName:fullName,
                ...updatedData
            }   
        }
    ,{
        new:true
    }).select("-password -refreshToken")
    
    return res
    .status(200)
    .json(
        new ApiResponse(200 , updatedUser , "Profile updated successfully")
    );


})

export {registerUser , loginUser , logoutUser , refreshAccessToken , getCurrentUser , updateProfile};