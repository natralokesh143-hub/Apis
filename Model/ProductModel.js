var mongoose = require("mongoose")

var productSchema = new mongoose.Schema({
    title:{
        unique:true,
        required:true,
        type:String
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    }
})

var Product = mongoose.model("products",productSchema)

module.exports = Product

