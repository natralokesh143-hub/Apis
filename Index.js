require("dotenv").config()

var express = require("express")

var useRoutes = require("./Routes/UserRoutes.js")
var productRoutes = require("./Routes/ProductRoutes.js")
const connectToDatabase = require("./DataBase/db.js")

var app = express()


app.use(express.json())

app.use("/api/userRoutes",useRoutes)

app.use("/api/productRoutes",productRoutes)




connectToDatabase()


var port = process.env.PORT

app.listen(port,()=>{
    console.log("The server is running");
})