import express from 'express' ;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config() ;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Connected To Mongoose ! ')
})
.catch((err)=>{
    console.log(err) ; 
});

const app=express() ;
const port=3000 ;

app.listen(3000,()=>{
    console.log(`Server running on port ${port}`)
})


