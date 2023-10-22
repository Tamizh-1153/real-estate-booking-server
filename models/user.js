const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: [true,'Please provide a name'],
  // },
  email: {
    type: String,
    required: [true,'Please provide a email address'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email address",
    ],
    unique: true,
  },
  // password:{
  //   type:String,
  //   required:[true,'Please provide a password'],
  //   minlength:6
  // },
  token:{
    type:String,
  },
  image: {
    type: String,

  },
  bookedVisits: {
    type: [Schema.Types.Mixed],
  },
  favResidenciesID: {
    type: [Schema.Types.ObjectId],
    ref:'Residency'
  },
  ownedResidencies: {
    type: [Schema.Types.ObjectId],
    ref: "Residency",
  },
})

// userSchema.pre('save',async function(){
//   const salt =await bcrypt.genSalt()
//   this.password=await bcrypt.hash(this.password,salt)
// })

userSchema.methods.generateJWT = function(){
  return jwt.sign(
    {userId:this._id,email:this.email},
    process.env.JWT_SECRET,
    {expiresIn:'1d'}
  )
}

userSchema.methods.comparePassword=async function(userPassword){
  const isMatch= await bcrypt.compare(userPassword,this.password)
  return isMatch
}


module.exports = mongoose.model("User", userSchema)
