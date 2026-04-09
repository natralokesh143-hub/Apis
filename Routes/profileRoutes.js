var express = require("express")
const { getProfile, updateProfile } = require("../Controller/profileController")
const authMiddleware = require("../MiddleWare/authMiddleware")

var router = express.Router()


router.get("/profile/:id", authMiddleware, getProfile)

router.put("/updateprofile/:id", authMiddleware, updateProfile)


module.exports = router 