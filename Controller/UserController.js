var User = require("../Model/UserModel")

var bcrypt = require("bcrypt")

var jwt = require("jsonwebtoken")





var registerUser = async(req,res)=>{
    try{
        var {name,email,password} = req.body || {}
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name, email, and password are required",
                hint: "Postman: Body → raw → JSON (or x-www-form-urlencoded with those field names)"
            })
        }
        var userExists = await User.findOne({email})
        if(userExists){
            return res.status(409).json({message : "user already exists"})
        }
        var hashPassword = await bcrypt.hash(password,10)

        var newUser = await User.create({
            name,
            email,
            password : hashPassword

        })
        res.status(201).json({
            message : "account created",
            user : {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })

        

    }catch(error){
        console.log("error",error);
        return res.status(500).json({ message: "registration failed", error: error.message })
    }
}



var login = async(req,res)=>{
    try{
        
        var {email,password} = req.body || {}
        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required",
                hint: "Postman: Body → raw → JSON (or x-www-form-urlencoded)"
            })
        }
        
        var userExists = await User.findOne({email})
        if(!userExists){
          return res.status(401).json({ message: "invalid email or password" })
        }
        var checkPassword = await bcrypt.compare(password,userExists.password)
        if(!checkPassword){
            return res.status(401).json({ message: "invalid email or password" })
            
        }

    var token = jwt.sign({
        userId : userExists._id,
        email : userExists.email,
        role : userExists.role
    },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" }
    )

    res.status(200).json({ message: "login done", webToken: token, token: token })

        
    }catch(error){
        console.log("error",error);
        return res.status(500).json({ message: "login failed", error: error.message })
    }
}

module.exports = {
    registerUser,login
}