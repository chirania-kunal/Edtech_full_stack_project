const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res) => {
    try{
        //data fetch
        const {sectionName, courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success : false,
                message : 'Missing Properties',
            })
        }

        // create Section
        const newSection = await Section.create({sectionName});
        // update the section id in the created course Schema
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                    courseId,
                                                    {
                                                        $push: {
                                                            courseContent : newSection._id,
                                                        }
                                                    },
                                                    {new : true}
                                                )
                                                .populate({
                                                    path: "courseContent",
                                                    populate : {
                                                        path : "subSection",
                                                    },
                                                })
                                                .exec();
        // return response
        return res.status(200).json({
            success : true,
            message : 'Section Created Successfully',
            updatedCourseDetails,
        })

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Unable to create section Please try again",
            error : error.message
        })
    }
}


exports.updateSection = async (req,res) => {
    try{
        // data input
        const {sectionName, sectionId}= req.body;

        // data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success : false,
                message :"Missing Properties",
            });
        }
        // update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new : true});
        // return res
        return res.status(200).json({
            success : true,
            message : 'Section Updated Successfully',
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Unable to update Section Please try again",
            error : error.message,
        });
    }
}

exports.deleteSection = async (req,res)=>{
    try{
        // get ID
        const sectionId= req.params;

        // validation
        if(!sectionId){
            return res.status(400).json({
                success : false,
                message :"Missing Properties",
            });
        }
        // use findByIdAndDelete to delete
        await Section.findByIdAndDelete(sectionId);

        // TO DO delete Section Id from the entry in the Course schema

        // return response
        return res.status(200).json({
            success : true,
            message : 'Section Deleted Successfully',
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Unable to delete Section Please try again",
        })
    }
}