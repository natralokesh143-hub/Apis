var mongoose = require("mongoose")

async function connectToDatabase(){
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to the database")
}



module.exports = connectToDatabase