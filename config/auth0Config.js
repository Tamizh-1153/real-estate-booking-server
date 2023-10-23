const {auth} =require('express-oauth2-jwt-bearer')


const jwtCheck = auth({
  audience: "https://real-estate-booking-tm.onrender.com",
  issuerBaseURL: "dev-elberx4si3yrfbfm.us.auth0.com",
  tokenSigningAlg: "RS256",
})

module.exports=jwtCheck