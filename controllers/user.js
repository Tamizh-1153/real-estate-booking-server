const User = require("../models/user")
var nodemailer = require("nodemailer")
require("dotenv").config()

const register = async (req, res) => {
  let {email}=req.body

  const userExists=await User.findOne({email})
  if (!userExists) {
  const user = await User.create({ ...req.body })
  res.json({ user: { name: user.name, email: user.email } })
  } else {
    res.json({message:'User already exists'})
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.json({ message: "Please provide valid email and password" })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.json({ message: "User not found" })
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    return res.json({ message: "Incorrect password" })
  }

  const token = user.generateJWT()
  res.json({ user: { name: user.name, email: user.email }, token })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ message: "User not found" })
    }

    const token = user.generateJWT()
    user.token = token
    await User.findOneAndUpdate({email},{token:user.token})
    const resetLink = `${process.env.FrontendURL}/api/v1/reset_password/${user._id}/${token}`

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })

    var mailOptions = {
      from: "tamizhwork@gmail.com",
      to: email,
      subject: "Password reset link",
      text: resetLink,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent" + info.response)
      }
    })

    res.json({ message: "Reset link sent via email", resetLink })
  } catch (error) {
    res.send(error.message)
  }
}

const resetPassword = async (req, res) => {
  const { id, token } = req.params
  const { password } = req.body

  const user = await User.findOne({ _id: id })

  if (!user) {
    return res.json({ message: "User not found" })
  }
  if (user.token != token) {
    return res.json({ message: "Invalid token" })
  }

  user.password = password
  user.token = ""
  await user.save()
  res.json({ message: "Password reset success" })
}



module.exports = { register, login, forgotPassword, resetPassword }
