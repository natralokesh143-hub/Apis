require("dotenv").config()
var cors = require("cors")

var express = require("express")

var userRoutes = require("./Routes/UserRoutes")
var productRoutes = require("./Routes/ProductRoutes")
var profileRoutes = require("./Routes/profileRoutes")

var cartRoutes = require("./Routes/cartRoutes.js")
var connectedToDatabase=require("./database/db.js")


var app = express()


app.use(express.json())
app.use(cors())

app.use("/", userRoutes)

app.use("/", productRoutes)

app.use("/", profileRoutes)

app.use("/", cartRoutes)






connectedToDatabase()



var port = process.env.PORT

app.listen(port, () => {
    console.log("The server is running");
})