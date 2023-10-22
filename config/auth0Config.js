const {auth} =require('express-oauth2-jwt-bearer')
require('dotenv').config()


const jwtCheck = auth({
  audience: process.env.audience,
  issuerBaseURL: process.env.issuerURL,
  tokenSigningAlg: "RS256",
})

module.exports=jwtCheck