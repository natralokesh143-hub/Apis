require("dotenv").config()
var cors = require("cors")

var express = require("express")
const connectToDatabase = require("./DataBase/db.js")
var userRoutes = require("./Routes/UserRoutes.js")
var productRoutes = require("./Routes/ProductRoutes.js")
var profileRoutes = require("./Routes/profileRoutes.js")
var cartRoutes = require("./Routes/cartRoutes.js")
var paymentRoutes = require("./Routes/paymentRoutes.js")
var orderRoutes = require("./Routes/orderRoutes.js")



var app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/health", (req, res) => {
    res.status(200).json({ ok: true })
})


app.use("/", userRoutes)

app.use("/",productRoutes)

app.use("/",profileRoutes)

app.use("/",cartRoutes)

app.use("/",paymentRoutes)

app.use("/",orderRoutes)


var port = process.env.PORT || 5000

connectToDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log("The server is running on port", port)
        })
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message)
        process.exit(1)
    })