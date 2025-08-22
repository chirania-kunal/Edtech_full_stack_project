const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/template/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");


// capture the payment and initiate the razorpay Order
exports.capturePayment = async (req,res)=>{
    try{
        // get  courseId and userId
        const {course_id} = req.body;
        const userId= req.user.id;
        // validation
        // valid courseId
        if(!course_id){
            return res.json({
                success :false,
                message : 'Please provide valid course id',
            });
        }
        // valid courseDetail
        let courseDetails;
        try{
            // course data fetched from dB
            courseDetails = await Course.findById(course_id);
            if(!courseDetails){
                return res.json({
                    success : false,
                    message : 'could not find the course',
                });
            }

            // user already pay for the same course or not check
            // convert userId (which is in string form) into (Object Id form)
            const uid = new mongoose.Types.ObjectId(userId);
            if(courseDetails.studentsEnrolled.includes(uid)){
                return res.status(403).json({
                    success : false,
                    message : 'Student is already enrolled',
                });
            }
        }catch(error){
            console.error(error);
            return res.status(500).json({
                success : false,
                error: error.message,
            })
        }
        
        // order create 
        const amount = courseDetails.price;
        const currency = "INR";

        const options={
            amount : amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId : course_id,
                userId,
            }
        };
        try{   
            // initiate the payment using razorpay
            const paymentsResponse = await instance.orders.create(options);
            console.log(paymentsResponse);
            // return response
            return res.status(200).json({
                success : true,
                courseName : courseDetails.courseName,
                courseDescription: courseDetails.courseDescription,
                thumbnail : courseDetails.thumbnail,
                orderId : paymentsResponse.id,
                currency : paymentsResponse.currency,
                amount : paymentsResponse.amount,
            });

        }catch(error){
            console.log(error);
            res.json({
                success : false,
                message : "Could not initiate order",
            });
        }
        // return res.status(200).json({
        //     success : true,
        // });

    }catch(error){
        return res.status(500).json({
            success : false,
            message : 'Error occurred while capturing the payment',
            error : error.message,
        });
    }
};

// output coming from hashing algorithm after performing some operation on it is termed as digest

// verify signature of Razorpay and Server
exports.verifySignature = async(req,res) => {
    try{
        // this secret is stored on server
        const webhookSecret = "12345678";
        // second signature is coming from razorpay and it is send in headers of the request in the key x-razorpay-signature
        const signature= req.headers["x-razorpay-signature"];
    
        // Steps to convert webhookSecret into hashed message so that we can verify with the signature coming from request
        // hashed based message authentication code - (uses hashing algo and secret_key) to generate hmac 
        // Step A:
        const shasum = crypto.createHmac("sha256",webhookSecret);
        // Step B:
        shasum.update(JSON.stringify(req.body));
        // Step C:
        const digest = shasum.digest("hex");

        if(signature === digest){
            console.log("Payment is Authorized");
            
            const {courseId, userId}= req.body.payload.payment.entity.notes;
            try{
                // fulfill the action after performing of payment

                // find the course and enroll the student in it 
                const enrolledCourse = await Course.findOneAndUpdate(
                                                    {_id: courseId},
                                                    {$psuh:{studentsEnrolled:userId}},
                                                    {new: true},
                );

                if(!enrolledCourse){
                    return res.status(500).json({
                        success : false,
                        message : 'Course not found',
                    });
                }

                console.log(enrolledCourse);

                // find the student and add course to their list enrolled courses
                const enrolledStudent = await User.findOneAndUpdate(
                                                        {_id:userId},
                                                        {$push:{courses : courseId}},
                                                        {new:true},
                );

                console.log(enrolledStudent);

                // mail Send cofirmation one 
                const emailResponse =  await mailSender(
                                                enrolledStudent.email,
                                                "Congratulations form StudyNotion",
                                                "Congratulation you are onboarded into new StudyNotion Course!",
                );

                console.log(emailResponse);
                return res.status(200).json({
                    success : true,
                    message : "Signature Verifed and Course Added",
                });
            }catch(error){
                console.log(error);
                return res.status(500).json({
                    success : false,
                    message : error.message,
                });
            }
        }
        else{
            return res.status(400).json({
                success : false,
                message : "Invalid Signature",
            })
        }

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Error occurred while verifying signature",
        })
    }

};
