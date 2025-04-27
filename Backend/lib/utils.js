import jwt from 'jsonwebtoken';
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

export const generateToken=(userId,res)=>{
    
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"});

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=="development",
    });

    return token;
}






//Email sending function using Brevo
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_MAIL_API_KEY; // Load API key from .env
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: process.env.BREVO_FROM_EMAIL, // Must be a verified sender in Brevo
      name: " Shared Delivery ", // Change this to your app name
    };

    const receivers = [{ email: to }];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject, 
      htmlContent,
    });

    console.log(`📩 Email sent to ${to}`);
  } catch (error) {
    console.error(
      "❌ Error sending email:",
      error.response ? error.response.body : error.message
    );
  }
};
