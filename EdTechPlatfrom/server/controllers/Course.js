const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


// createCourse handler function
exports.createCourse = async (req , res) => {
    try{
        // Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation 
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail ){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
        }

        if (!status || status === undefined) {
			status = "Draft";
		}

        // check for instructor i.e  user who is creating course must be there in dB 
        // user object is there in request line
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId,
            {accountType: "Instructor"}
        );
        console.log("Instructor Details : ",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : 'Instructor Details not found',
            });
        }

        // check given tag is valid or not
        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(404).json({
                success : false,
                message : 'Category Details not found',
            })
        }

        // Upload thumbnail image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        console.log(thumbnailImage);

        // Create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price : price,
            tag : tag,
            category: categoryDetails._id,
            thumbnail : thumbnailImage.secure_url,
            status : status,
            instructions : instructions,
        });

        // add the new course to the user Schema of Instructor
        await User.findByIdAndUpdate(
            {  _id  : instructorDetails._id },
            {
                $push : {
                    courses : newCourse._id,
                }
            },
            {new : true},
        );

        // Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);

        // return response
        return res.status(200).json({
            success : true,
            message : "Course created Successfully!",
            data : newCourse,
        });

    }catch(error){
        // Handle any errors that occur during the creation of the course
		console.error(error);
        return res.status(500).json({
            success : false,
            message : "Failed to create Course",
            error: error.message,
        })
    }
};




// getAllCourses handler function
exports.getAllCourses = async(req,res) =>{
    try{
        // find all courses using find method
        const allCourses = await Course.find({},{courseName : true,
                                                price : true,
                                                thumbnail : true,
                                                instructor: true,
                                                ratingAndReviews : true,
                                                studentsEnrolled : true})
                                                .populate("instructor")
                                                .exec();
                                                
        return res.status(200).json({
            success : true,
            message : 'Data for all courses fetched successfully',
            data : allCourses,
        })
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : 'Cannot fetch course data',
            error : error.message,
        })
    }
}

// getCourse Detail
exports.getCourseDetails = async(req,res)=>{
    try{
        // data fetch course id from req body
        const {courseId} = req.body; 

        // validate 
        if(!courseId){
            return res.status(403).json({
                success : false,
                message : 'CourseId is missing',
            });
        }

        // find coursedetails check whether course exists or not
        const courseDetails = await Course.find(
                                            {_id : courseId})
                                            .populate(
                                                {
                                                    path: "instructor",
                                                    populate: {
                                                        path: "additionalDetails",
                                                    },
                                                }
                                            )
                                            .populate("category")
                                            .populate("ratingAndReviews")
                                            .populate({
                                                path : "courseContent",
                                                populate:{
                                                    path : "subSection",
                                                },
                                            })
                                            .exec();

        if(!courseDetails){
            return res.status(400).json({
                success : false,
                message : `Could not find the course with ${courseId}`,
            });
        }

        // return response
        return res.status(200).json({
            success : true,
            message : "Course Details fetched successfully",
            data : courseDetails,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : 'Error while fetching particular Course',
            error : error.message,
        });
    }
}