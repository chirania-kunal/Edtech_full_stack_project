const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// resetPasswordToken -> sends mail with url to the user's mail so that he can change its password
exports.resetPasswordToken = async(req,res) => {
   try{
        // get email form request body
        const email = req.body.email;

        if(!email){
            return res.status(403).json({
                success: false,
                message: "Fill email carefully! ",
            })
        }

        // check user for this email , email validation
        const user = await User.findOne({email : email});

        if (!user){
            return res.status(401).json({
                success : false,
                message : `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }

        // generate token 
        const token = crypto.randomBytes(20).toString("hex");

        // update user by adding token and expiration time 
        const updatedDetails = await User.findOneAndUpdate(
                                            {email : email},
                                            {
                                                token :token,
                                                resetPasswordExpires : Date.now()+5*60*1000,
                                            },
                                            {new : true});
        console.log("DETAILS", updatedDetails);
                                        
        // create url 
        const url = `http://localhost:3000/update-password/${token}`
                                        
        // send mail containing the url
        await mailSender(email,
                        "Password Reset Link",
                        `Password Reset Link: ${url} `);
        // return response
        return res.json({
            success :true,
            message : 'Email Sent successfully, Please check email and change pwd',
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong while reset Password'
        })
    }

}


// resetPassword
exports.resetPassword = async (req,res)=>{
  try{
      //data fetch  // frontend has put all the below data in the request body.
      // token will be required to update the user password
      const {password , confirmPassword,token} = req.body;

      // validation
      if(password !== confirmPassword){
          return res.status(401).json({
              success : false,
              message : 'Password not matching',
          });
      }
  
      // get userdetails from db using token 
      const userDetails = await User.findOne({token : token});
  
      // if no entry - invalid token
      if(!userDetails){
          return res.status(401).json({
              success : false,
              message: 'Token is invalid',
          })
      }
      // token time check
      if(userDetails.resetPasswordExpires < Date.now()){
          return res.status(401).json({
              success : false,
              message : 'Token is expired, Please regenerate your token',
          });
      }
      // hash Pwd
      const hashedPassword = await bcrypt.hash(password,10);
  
      // password update and file user data through token in user model
      await User.findOneAndUpdate(
          {token : token}, // finding key 
          {password : hashedPassword}, // updating key
          {new : true},
      );
      // return response
      return res.status(200).json({
          success : true,
          message : 'Password reset Successfully!',
      });
  }catch(error){
    return res.status(500).json({
        success : false,
        message : "Error occurred while reseting Password",
    });
  }
}