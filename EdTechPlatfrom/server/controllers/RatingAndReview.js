const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
// create Rating
exports.createRating = async(req,res) => {
    try{
        // get user id
        const userId = req.user.id;

        // fetch data from req body
        const {rating , review , courseId} = req.body;

        // check if user is enrolled or not 
        const courseDetails = await Course.findOne(
                                            {_id : courseId,
                                            studentsEnrolled :{$elemMatch: {$eq : userId} },
                                            });

        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : 'Student is not enrolled in the course',
            });
        }
        // check if user already reviewed course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                user: userId,
                                                course: courseId,
        });
        if(alreadyReviewed){
            return res.status(403).json({
                success : false,
                message : 'Course is already reviewed by the user',
            });
        }

        // create Rating and review 
        const ratingReview = await RatingAndReview.create({
                                            rating,review,
                                            course: courseId,
                                            user: userId,
        });
        // update course with rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                        {
                                            $push:{
                                                ratingAndReviews : ratingReview._id,
                                            }
                                        },
                                        {new : true}
        );

        console.log(updatedCourseDetails);
        // return response
        res.status(200).json({
            success : true,
            message : 'Rating And Review created successfully',
            ratingReview,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Rating And Review not created ",
            error : error.message,
        });
    }
}
// getAverage Rating
exports.getAverageRating = async(req,res)=>{
    try{
        // get course id
        const courseId = req.body.courseId;
        // calculate average rating 
        const result  = await RatingAndReview.aggregate(
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating : {
                        $avg: "$rating"
                    }
                }
            }
        )

        if(result.length>0){
            return res.status(200).json({
                success : true,
                averageRating: result[0].averageRating,
            })
        }

        // if no rating/Review exist 
        return res.status(200).json({
            success : true,
            messsage : "Average Rating is 0, no ratings given till now",
            averageRating: 0,
        })
        // return rating 
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occurred while getting average rating",
            error : error.message,
        });
    }
}
// getAllRating
exports.getAllRating = async(req,res)=>{
    try{
        const allReviews = await RatingAndReview.find({})
                                            .sort({rating: "desc"})
                                            .populate({
                                                path : "user",
                                                select : "firstName lastName email image",
                                            })
                                            .populate({
                                                path : "course",
                                                select: "courseName",
                                            })
                                            .exec();

        // return response
        return res.status(200).json({
            success : false,
            message : "All reviews fetched successfully",
            data : allReviews,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occurred while getting average rating",
            error : error.message,
        });
    }
}