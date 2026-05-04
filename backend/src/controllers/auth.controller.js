const usermodel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistmodel = require('../models/blacklist.model');
/** 
 * @name registerUsercontroller
 * @description Controller to handle user registration
 * @access Public   
 */

async function registerUsercontroller(req,res) {
    
const {username,email,password} = req.body;

if(!username || !email || !password){
    return res.status(400).json({message:'All fields are required'});
}
 const userAlreadyExists = await usermodel.findOne({$or:[{username},{email}]});
    if(userAlreadyExists){
        return res.status(400).json({message:'Username or email already exists'});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new usermodel({
        username,
        email,
        password:hashedPassword
    });
  await newUser.save();
const token= jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1d'});
res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
});
    res.status(201).json({
        message:'User registered successfully',
        user:{
            id:newUser._id,
            username:newUser.username,
            email:newUser.email
        }

    });
}

/**
 * @name loginUsercontroller
 * @description Controller to handle user login
 * @access Public
 */

async function loginUsercontroller(req,res) {
    const {email,password} = req.body;

   const user= await usermodel.findOne({email});
   if(!user){
    return res.status(400).json({message:'Invalid email or password'});
   }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:'Invalid email or password'});
    }
    const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    res.cookie("token",token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    });
    res.status(200).json({
        message:'User logged in successfully',
        user:{ 
            id:user._id,
            username:user.username,
            email:user.email
        }
    });
}

/**
 * @name logoutUsercontroller
 * @description Controller to handle user logout (blacklist token)
 * @access Public
 */

async function logoutUsercontroller(req,res) {
  const token = req.cookies.token;
  if(token){
    await tokenBlacklistmodel.create({token});
  }
  res.clearCookie("token");
  res.status(200).json({message:'User logged out successfully'});

}


/**
 * @name getMeController
 * @description Controller to get current logged in user details
 * @access Private  
 */
async function getMeController(req,res) {
    const userId = req.userId;
    const user = await usermodel.findById(userId).select('-password');
    res.status(200).json({
        message:'User details fetched successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    });
}

module.exports={registerUsercontroller,loginUsercontroller,logoutUsercontroller,getMeController};