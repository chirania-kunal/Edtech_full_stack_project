const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");


const database = require("./config/database");
const cookieParser = require("cookie-parser");

// to entertain the request of frontend by backend , for this we need cors
const cors= require("cors");
const {cloudinaryConnect}=  require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

// database connect
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        // request coming from the below origin will be handled by backend
        origin : "http://localhost:3000",
        credentials : true,
    })
)

app.use(
   fileUpload({
        useTempFiles : true,
        tempFileDir : "/temp",
   })
)

cloudinaryConnect();

// routes mounting
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

// def route
app.get("/", (req,res)=>{
    return res.status(200).json({
        success : true,
        message :"Your server is up and running",
    });
});

app.listen(PORT,()=>{
    console.log(`App is runnig at ${PORT}`);
})
