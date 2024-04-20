import express from 'express' ;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js' ;
import authRouter from './routes/auth.route.js' ;
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js' ;
dotenv.config() ;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Connected To Mongoose ! ')
})
.catch((err)=>{
    console.log(err) ; 
});

const app=express() ;

app.use(express.json()) ;
app.use(cookieParser());
const port = 3000 ;

app.listen(3000,() => {
    console.log(`Server running on port ${port}`)
})


app.use('/api/user', userRouter) ;
app.use('/api/auth', authRouter) ;
app.use('/api/listing', listingRouter) ;

app.use((err, req, res, next)  => {
    const statusCode = err.statusCode || 500 ;
    const message = err.message || 'Internal Server Error !'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    }) ;
})
