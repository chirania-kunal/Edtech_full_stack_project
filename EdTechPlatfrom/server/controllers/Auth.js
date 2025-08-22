const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/template/passwordUpdate");

require("dotenv").config();


// sendOTP fuction will handle generation of OTP which could be send throught pre- hook handler
exports.sendOtp = async (req , res) => {
    try{
        // fetch email from request ki body 
        const {email} = req.body;

        if(!email){
            return res.status(403).json({
                success: false,
                message: "Fill email carefully! ",
            })
        }
    
        // check if user already exists
        // Find user with provided email
        const checkUserPresent = await User.findOne({email});
    
        // if user already exist , then return a response
        if(checkUserPresent){
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success : false,
                message : "User already registered",
            })
        }

        // generate OTP through generate function of length 6 
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });

        // check unique otp or not
        let result = await OTP.findOne({otp : otp});
        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                speccialChars : false,
            });
            result = await OTP.findOne({otp: otp});
        }

        // otp object
        const otpPayload =  {email,otp};

        // pre-save middleware hook will send an OTP to the mail before creating an entry into the database.
        // In the OTP model
        // create an entry for OTP in a database to match the otp after the user entered the OTP in the frontend.
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body",otpBody);

        // return response successful
        res.status(200).json({
            success : true,
            message : 'OTP Sent Successfully',
            otp,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
};

// Signup Controller for Registering USers
exports.signUp = async (req,res) => {
    try{
        // data fetch from request Body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,  // otp sending by client
        } = req.body;
        // validate the data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){
            return res.status(403).json({
                success: false,
                message : "All fields are required",
            });
        }
        // match both the password
        if(password !== confirmPassword){
            return res.status(400).json({
                success : false,
                message : 'Password and ConfirmPassword Value does not match, Please try again.'
            });
        }
    
        // check user already exist or Not
        // findOne will return null or document related to email
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message : 'User is already registered',
            });
        }
    
        // find most recent OTP stored for the User
        // The sort method orders the results based on the createdAt field.
        // { createdAt: -1 } means the results are sorted in descending order of createdAt (newest to oldest).
        // limit(1) :  The limit method restricts the number of documents returned to 1.
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        
        // validate OTP
        if(recentOtp.length ==0 ){
            // OTP not found
            return res.status(400).json({
                success: false,
                message : 'OTP not found',
            })
        } else if (otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success : false,
                message : "Invalid OTP",
    
            })
        }
    
    
        // Hash Password
        const hashedPassword = await bcrypt.hash(password,10);
        
        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        // Create the Additional Profile For User
        // entry create in DB - since we need object id of Profile so we have to create a entry in the database.
        const profileDetails = await Profile.create({
            gender : null,
            dateOfBirth: null,
            about : null,
            contactNumber: null,
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            approved: approved,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
    
        // return res
        return res.status(200).json({
            success: true,
            message: 'User is registered successfully',
            user,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message: 'User cannot be registered successfully. Please try again. ',
        })
    }

}


// Login controller for authenticating users
exports.login = async (req,res) => {
    try{
        // get data from req.body
        const {email,password} = req.body;

        // validation data
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please Fill up All the Required Fields',
            });
        }
        // user check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User is not registered  , please signup first",
            })
        }
        // password match through compare function
        if(await bcrypt.compare(password,user.password)){

            // generate JWT token 
            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType,
            }
            const token = jwt.sign(payload, 
                                process.env.JWT_SECRET, 
                                {
                                expiresIn:"2h",
                                }
                            );

            user.token = token;
            user.password = undefined;

            // create cookie and send respone
            const options = {
                expiresIn : new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly : true,
            }

            res.cookie("token",token,options).status(200).json({
                success : true,
                token,
                user,
                message : 'Logged in Successfully',
            })
            
        }else{
            return res.status(401).json({
                success : false,
                message : "Password is incorrect",
            });
        }
    }catch (error) {
        console.log(error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success : false,
            message : 'Login Failed, Please try agian',
        })
    }
}


// changePassword
exports.changePassword = async (req,res) => {
    try{
        const userId= req.user.id;
        // get data from req.body i.e (oldPassword, newPassword, confirmPassword)
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        // validation
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
               success : false,
               message : 'Fill the details properly' ,
            })
        }

        if(!userId){
            return res.status(400).json({
                success: false,
                message : "User Id is missing",
            });
        }
        // Get user data from req.user
        const userDetails = await User.findById(userId);

        // Validate old Password
        const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password);
        
        if(!isPasswordMatch){
            // If old password does not match, return a 401 (Unauthorized) error
            return res.status(401).json({
                success : false,
                message : "The password is incorrect",
            });
        }

        // Match new password and confirm new Password
        if(newPassword !==confirmNewPassword){
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			})
        }

        // update pwd in dB
        const encryptedPassword = await bcrypt.hash(newPassword,10);
        const updatedUserDetails = await User.findByIdAndUpdate(
                                        req.user.id,
                                        {password:encryptedPassword},
                                        {new : true}
        );

        // send notification Mail - Password updated
        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        }catch(error){
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }
        // return response
        return res.status(200).json({
            success : true,
            message : "Password Updated Successfully",
        });

    }catch (error){
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
    }
}
