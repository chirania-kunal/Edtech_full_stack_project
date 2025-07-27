const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Controller for Updating a Profile
exports.updatedProfile = async (req,res)=>{
    try{
        // get Data
        const {dateOfBirth="",about="",contactNumber,gender} =req.body;
        // getUserId
        const id = req.user.id;
        // validtion
        if(!contactNumber || !gender || !id){
            return res.status.json({
                success : false,
                message : 'All fields are required',
            })
        } 
        // find Profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update Profile
        profileDetails.dateOfBirth= dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        
		// Save the updated profile
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success : true,
            message : 'Profile Updated Successfully',
            profileDetails,
        });

    }catch(error){
        return res.status(500).json({
            success : false,
            message : 'Profile Details not updated successfully',
            error : error.message,
        });
    }
};

// delete Account
exports.deleteAccount = async(req,res) => {
    try {
        // Validate user ID
        console.log("Printing ID:", req.user.id);
        const id = req.user.id;
    
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid user ID",
          });
        }
    
        // Check if user exists
        const userDetails = await User.findById(id);
        if (!userDetails) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
    
        // Delete associated profile if it exists
        if (userDetails.additionalDetails) {
          if (mongoose.Types.ObjectId.isValid(userDetails.additionalDetails)) {
            await Profile.findByIdAndDelete(userDetails.additionalDetails);
          } else {
            console.warn("Invalid Profile ID:", userDetails.additionalDetails);
          }
        }
    
        // TODO: Unenroll user from all enrolled courses
    
        // Delete user
        await User.findByIdAndDelete(id);
    
        // Return response
        return res.status(200).json({
          success: true,
          message: "Account deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({
          success: false,
          message: "Account cannot be deleted",
          error: error.message,
        });
      }
}


exports.getAllUserDetails = async(req,res)=>{
    try{
        // get id 
        const id = req.user.id;
        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return response
        return res.status(200).json({
            success : true,
            message : 'User Data fetched Successfully',
        })

    }catch(error){
        return res.status(500).json({
            success : true,
            message :'User  cannot be fetched',
            error : error.messsage,
        }) 
    }
}


exports.deleteAccount = async (req, res) => {
	try {
		// TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
		const id = req.user.id;
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Delete Assosiated Profile with the User
		await Profile.findByIdAndDelete({ _id: user.userDetails });
		// TODO: Unenroll User From All the Enrolled Courses
		// Now Delete User
		await user.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully" });
	}
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//updateDisplayPicture

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

// getEnrolledCourses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};