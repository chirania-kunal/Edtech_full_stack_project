const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

// create  Subsection
exports.createSubSection = async(req,res) => {
    try{
        // data fetch from req.body
        const {title,description,sectionId,timeDuration} = req.body;
        // extract files/video
        const video = req.files.videoFile

        // validation
        if(!sectionId || !description || !timeDuration || !title || !video){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
        }
        // upload video to cloudinary (fetch the secure url)
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        // create a SubSection
        const SubSectionDetails = await SubSection.create({
            title : title,
            timeDuration : timeDuration,
            description : description,
            videoUrl: uploadDetails.secure_url,
        });
        // update Section Schmea with the SubSection id
        const updatedSection = await Section.findByIdAndUpdate({_id : sectionId},
                                                        {
                                                            $push: {
                                                                subSection : SubSectionDetails._id,
                                                            }
                                                        },
                                                        {new : true});
        
        // HW Log updated Section here after adding populate query
        // return response
        return res.status(200).json({
            success : true,
            message : 'Sub Section Created Successfully',
            updatedSection,
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Unable to Create Subsection",
            error: error.message
        })
    }
}

// H.W update SubSection 
exports.updateSubSection = async(req,res)=>{
    try{
       // data fetch from req.body
       const{title,description,subSectionId,timeDuration} = req.body;
        // extract files/video if new video to be uploaded 
        const updatedvideo = req.files.videoFile;
       // validation
       if(!title || !description || !subSectionId || !timeDuration){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
       }
        // upload video to cloudinary (fetch the secure url)
        const updatedVideoDetails = await uploadImageToCloudinary(updatevideo,process.env.FOLDER_NAME);
       // update data in DB 
       const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId,
                                                {
                                                  title : title,
                                                  description : description,
                                                  timeDuration : timeDuration,
                                                  videoUrl :updatedVideoDetails.secure_url,
                                                },
                                                {new : true});
       // return response 
       return res.status(200).json({
            success : true,
            message : "SubSection Updated Successfully",
            error : error.message,
       })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Unable to Update Subsection",
            error: error.message
        })
    }
}


// H.W delete Section
exports.deleteSubSection = async(req,res)=>{
    try{
        // get id
        const {subSectionId} = req.body;
        // validation 
        if(!subSectionId){
            return res.status(400).json({
                success : false,
                message : 'All fields are required',
            });
        }
        // delete entry form the database
        await SubSection.findByIdAndDelete(subSectionId);
        // TO DO delete Sub-Section Id from the entry in the Section schema
        // return response
        return res.status(200).json({
            success : true,
            message :"SubSection Deleted Successfully",
        });
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Unable to Delete Subsection",
            error: error.message
        })
    }
}
