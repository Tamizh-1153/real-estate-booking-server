const mongoose = require("mongoose")
const { Schema } = require("mongoose")
const User =require('./user')

const residencySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    image: {
      type: String,
    },
    country: {
      type:String,
    },
    facilities: {
      type: Schema.Types.Mixed,
    },
    userEmail: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

residencySchema.pre('save',async function(next){
  if(this.isNew){
    const user =await User.findOne({email:this.userEmail})

    if(user){
      user.ownedResidencies.push(this._id)
      await user.save()
    }
  }
  next()
})

module.exports = mongoose.model("Residency", residencySchema)
