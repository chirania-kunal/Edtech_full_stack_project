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
exports.deleteSection = async (req, res) => {
    try {
        const sectionId = req.params.id;

        // Validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing section ID",
            });
        }

        // Fetch the section to get course ID before deleting
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        const courseId = section.courseId; // Make sure your Section schema includes this field

        // Delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        // Remove the section reference from the course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: {
                    courseContent: sectionId,
                },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: updatedCourse,
        });

    } catch (error) {
        console.error("Error deleting section:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete section. Please try again.",
        });
    }
};
