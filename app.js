const express=require('express')
const app=express()
require('dotenv').config()
const cors=require('cors')
const cookieParser=require('cookie-parser')

const connectDB=require('./db/connectDB')

const userRouter=require('./routes/user')
const residencyRouter=require('./routes/residency')

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api/v1',userRouter)
app.use('/api/v1/residency',residencyRouter)

const start=async()=>{
    try {
       await connectDB(process.env.MONGO_URI)
        app.listen(5000,()=>console.log('Server is listening on port 5000...'))
    } catch (error) {
        console.log(error);
    }
}

start()