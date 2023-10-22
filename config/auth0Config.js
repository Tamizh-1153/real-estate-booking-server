const {auth} =require('express-oauth2-jwt-bearer')
require('dotenv').config()


const jwtCheck = auth({
  audience: "https://real-estate-booking-tm.onrender.com",
  issuerBaseURL: "https://dev-elberx4si3yrfbfm.us.auth0.com/",
  tokenSigningAlg: "RS256",
})

module.exports=jwtCheck