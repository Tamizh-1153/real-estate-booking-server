const express = require("express")
const router = express.Router()

const {
  createResidency,
  getAllResidencies,
  getResidency,
  bookResidency,
  getAllBookings,
  cancelBookings,
  toggleFavResidency,
  getAllFavResidencies,
} = require("../controllers/residency")
const jwtCheck = require("../config/auth0Config")

router.route("/create").post(jwtCheck, createResidency)
router.route("/all").get(getAllResidencies)
router.route("/:id").get(getResidency)
router.route("/book/:id").post(jwtCheck,bookResidency)
router.route("/bookings/all").post(jwtCheck, getAllBookings)
router.route("/bookings/cancel/:id").post(jwtCheck,cancelBookings)
router.route("/toggle_fav/:id").post(jwtCheck, toggleFavResidency)
router.route("/favorite/all").post(jwtCheck, getAllFavResidencies)

module.exports = router
