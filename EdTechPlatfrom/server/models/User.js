const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            trim : true,
        },
        lastName : {
            type : String,
            required : true,
            trim : true,
        },
        email : {
            type : String,
            required : true,
            trim : true,
        },
        password : {
            type : String,
            required : true,
        },
        accountType : {
            type : String,
            enum : ["Admin","Student", "Instructor"],
            required : true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        approved: {
            type: Boolean,
            default: true,
        },
        additionalDetails : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "Profile",
        },
        courses : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Course",
            }
        ],
        image : {
            type : String,
            required : true,
        },
        token : {
            type : String ,
        },
        resetPasswordExpires : {
            type : Date,
        },
        courseProgess : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "CourseProgress",
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User",userSchema);