var express = require("express")
const { registerUser, login } = require("../Controller/UserController")


var router = express.Router()


router.post("/register",registerUser)

router.post("/login",login)


module.exports = router 

