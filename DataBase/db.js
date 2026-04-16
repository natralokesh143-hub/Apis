var mongoose = require("mongoose")

async function connectToDatabase(){
    if (!process.env.MONGO_URL || String(process.env.MONGO_URL).trim() === "") {
        throw new Error("MONGO_URL is missing or empty in environment (.env)")
    }
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to the database")
}



module.exports = connectToDatabase