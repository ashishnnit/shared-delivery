import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendEmail } from "../lib/utils.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signup=async (req, res) => {
    const {fullName,email,password}=req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);


        const newUser=new User({
            fullName,
            email,
            password:hashedPassword,
        });

        if(newUser){
             // Generate jwt token
             generateToken(newUser._id,res);
             await sendEmail(email,"Welcome to Shared Delivery","<h1>Welcome to Shared Delivery</h1><p>We are glad to have you on board.</p>");
             await newUser.save();

             res.status(201).json({
                    _id:newUser._id,
                    fullName:newUser.fullName,
                    email:newUser.email,
             });

        }else{
            return res.status(400).json({message:"Invalid user data"});
        }
    }catch(err){
        console.log(err.message);
        res.status(500).json({message:"Some  Error"});

    }
}

export const login= async (req, res) => {
    const {email,password}=req.body;
    try{
      const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

       const isPasswordCorrect= await bcrypt.compare(password,user.password);

       if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
       }

       generateToken(user._id,res);

       res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
       });

    }catch(err){
        console.log(err.message);
        res.status(500).json({message:"Internal Server  Error"});
    }
}

export const loginAdmin= async (req, res) => {
    const {email,password}=req.body;
    console.log("admin login backend")
    try{
      const admin=await Admin.findOne({email});

        if(!admin){
            return res.status(400).json({message:"Invalid credentials"});
        }

       const isPasswordCorrect= await bcrypt.compare(password,admin.password);

       if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
       }

       generateToken(admin._id,res);

       res.status(200).json({
            _id:admin._id,
            fullName:admin.fullName,
            email:admin.email,
       });

    }catch(err){
        console.log(err.message);
        res.status(500).json({message:"Internal Server  Error"});
    }
}

export const logout=(req, res) => {
   try{
      res.cookie("jwt","",{maxAge:0});
      res.status(200).json({message:"Logged out successfully"});
   }catch(error){
    console.log(err.message);
    res.status(500).json({message:"Internal Server  Error"});
   }
}


export const checkAuth=(req, res) => {
   try {
     res.status(200).json(req.user);
   } catch (error) {
    console.log("Error in checkAuth controller",error.message);
    res.status(500).json({message:"Internal Server  Error"});
   }
}

export const checkAuthAdmin=(req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
     console.log("Error in checkAuth controller",error.message);
     res.status(500).json({message:"Internal Server  Error"});
    }
 }

export const forgotPassword=async (req,res) => {
    const {email} = req.body;
    console.log(email);
    
    try {
        const user = await User.findOne({ email });


        if(user){
            const resetToken = jwt.sign(
                { id: user._id },
                process.env.JWT_FORGET_PASSWORD_SECRET,
                { expiresIn: "15m" }
              );

            
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            
            await sendEmail(
                email,
                "Password Reset Request",
                `<h1>Password Reset Request</h1><p>Click <a href="${resetUrl}">${resetUrl}</a> to reset your password.</p>`
              );

            res.status(200).json({message:"Email sent successfully"});

        } else {
            return res.status(400).json({message:"User not found"});
        }
    } catch (error) {
        console.log("Error in forgotPassword controller",error.message);
        res.status(500).json({message:"Internal Server  Error"});
        
}
}

export const resetPassword = async(req, res) => {
    const { password, token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_FORGET_PASSWORD_SECRET);
        const userId = decoded.id;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        

         // Optionally, you can log the user out after resetting the password
         res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in resetPassword controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}