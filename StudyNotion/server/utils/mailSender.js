const nodemailer = require('nodemailer');
require("dotenv").config();

const mailSender = async (email, title , body ) => {
    try{
        // creating transporter through nodemailer createTransport function
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,  // for example if we use gmail then we will use gmail.smtp
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from : 'StudyNotion || Kunal',
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`,
        }) 
        console.log(info);
        return info;

    }catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender;