import express from "express";
const app = express();
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors'
import cookieParser from "cookie-parser";

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);



app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());


import BookRouter from './routes/book.router.js'
app.use("/api/book",BookRouter)


export  {app};