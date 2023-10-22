const Residency = require("../models/residency")
const User = require("../models/user")

const createResidency = async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    city,
    image,
    country,
    facilities,
    userEmail,
  } = req.body
  console.log(req.body);
  try {
    const residency = await Residency.create({ ...req.body.data })
    res.send("Residency created successfully")
  } catch (error) {
    res.send("Residency not created")
  }
}

const getAllResidencies = async (req, res) => {
  try {
    const residencies = await Residency.find().sort({ createdAt: -1 })
    res.json({ residencies })
  } catch (error) {
    res.send(error.message)
  }
}

const getResidency = async (req, res) => {
  const { id } = req.params
  try {
    const residency = await Residency.findOne({ _id: id })
    res.json(residency)
  } catch (error) {
    res.send(error.message)
  }
}

const bookResidency = async (req, res) => {
  const { id } = req.params
  const { email, date } = req.body

  try {
    const alreadyBooked = await User.findOne({ email })
    if (
      alreadyBooked.bookedVisits.some(
        (visit) => visit.id == id && visit.date == date
      )
    ) {
      res.json({ message: "Residency already booked" })
    } else {
      await User.findOneAndUpdate(
        { email },
        { $push: { bookedVisits: { id, date } } }
      )
      res.json({ message: "Residency Booked" })
    }
  } catch (error) {
    res.send(error.message)
  }
}

const getAllBookings = async (req, res) => {
  const { email } = req.body
  try {
    const bookings = await User.findOne({ email }, { bookedVisits: 1,_id:0 })
    res.json(bookings)
  } catch (error) {
    res.send(error.message)
  }
}

const cancelBookings = async (req, res) => {
  const { email } = req.body
  const { id } = req.params

  try {
    const user = await User.findOne({ email }, { bookedVisits: 1, _id: 0 })
    console.log(user)
    const residencyIndex = user.bookedVisits.findIndex((item) => item.id == id)
    if (residencyIndex === -1) {
      res.json({ message: "Booking not found" })
    } else {
      user.bookedVisits.splice(residencyIndex, 1)
      await User.findOneAndUpdate(
        { email },
        { bookedVisits: user.bookedVisits }
      )
      res.json({ message: "Booking cancelled successfully" })
    }
  } catch (error) {
    res.send(error.message)
  }
}

const toggleFavResidency = async (req, res) => {
  const { email } = req.body
  const { id } = req.params

  try {
    const user = await User.findOne({ email })

    if (user.favResidenciesID.includes(id)) {
      const removeFav = user.favResidenciesID.filter((item) => item != id)
      const updateFav = await User.findOneAndUpdate(
        { email },
        { favResidenciesID: removeFav }
      )
      res.json({ message: "Fav removed successfully", updateFav })
    } else {
      const updateFav = await User.findOneAndUpdate(
        { email },
        {$push:{ favResidenciesID: id }}
      )
      res.json({ message: "Fav added successfully", updateFav })
    }
  } catch (error) {
    res.send(error.message)
  }
}

const getAllFavResidencies = async (req, res) => {
  const {email}=req.body

  try {
    const favRes = await User.findOne({email},{favResidenciesID:1,_id:0})
    res.json({favRes})
  } catch (error) {
    res.send(error.message)
  }
}

module.exports = {
  createResidency,
  getAllResidencies,
  getResidency,
  bookResidency,
  getAllBookings,
  cancelBookings,
  toggleFavResidency,
  getAllFavResidencies
}
