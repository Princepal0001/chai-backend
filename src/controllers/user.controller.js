import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
   const {fullname,email,username,password} = req.body
   console.log("email : ",email);
    // if(fullname === ""){
    //     throw new ApiError(400,"Full name is required")
    // }
    if(
        [email,fullname,password,username].some((field) => field?.trim()==="")
    ){
        throw new ApiError(400,"all fields are required")
    }
  const existedUser =  User.findOne({
    $or: [{ username },{ email }]
    })

  if(existedUser){
    throw new ApiError(409,"username and email is already exists")
  }
  const avatarLoacalPath = req.files?.avatar[0]?.path;

  const converImageLocalPath = req.files?.coverImage[0]?.path;
  if(!avatarLoacalPath){
    throw new ApiError(400,"avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLoacalPath)
  const coverImage  = await uploadOnCloudinary(converImageLocalPath)
  if(!avatar){
    throw new ApiError(400,"avatar file is required")
  }
 const user = await User.create({
    fullname,
    avatar : avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
  })

   const createdUser = await User.findById(user._id).select(
    " -password -refreshToken"
   )
   if(!createdUser){
    throw new ApiError(500,"something wnent wrong while registering user")
   }

  return res.status(201).json(
    new apiResponse(200,createdUser,"User registered sucessfully")
  )
    
})

export {registerUser}