
var Product = require("../Model/ProductModel");
const { uploadToCloudinary } = require("../helper/cloudinaryhelper");
var mongoose = require("mongoose")





var getAllProducts = async(req,res)=>{
    try{
        var allProducts =  await Product.find()
        console.log(req.user);
        return res.status(200).json({products: allProducts})

    }catch(error){
        console.log("error",error);
        return res.status(500).json({ message: "failed to fetch products", error: error.message })
    }
}


var getSingleProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var singleProduct = await  Product.findById(id)
        return res.status(200).json({singleProduct})

    }catch(error){
        console.log("error",error);
        return res.status(500).json({ message: "failed to fetch product", error: error.message })
    }
}

var addNewProduct = async(req,res)=>{
    try{

        var {title,description,price} = req.body
        if(!req.file){
            return res.status(400).json({message : "file missing"})
        }
        // upload to cloudinary
        var {url,publicId} = await uploadToCloudinary(req.file.path)
        var newProduct = await Product.create({
        title,
        description,
        price,
        image : {
            url,
            publicId
        }
    })
    return res.status(201).json({message : "productadded",product : newProduct})
    }catch(error){
        console.log("error",error);
        return res.status(500).json({ message: "failed to add product", error: error.message })
    }
}

var updateProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var {title,description,price} = req.body
        var update = await Product.findByIdAndUpdate(id,{
            title,
            description,
            price

        },{
            new : true
        })
        return res.status(201).json({message : "product updated",data : update})

    }catch(error){
        console.log("error",error);
        return res.status(500).json({ message: "failed to update product", error: error.message })
    }
}

var deleteProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var deletePro = await Product.findByIdAndDelete(id)
        return res.status(200).json({message : "product deleted"})

    }catch(error){
        console.log("error",error);
        return res.status(500).json({ message: "failed to delete product", error: error.message })
    }
}

var getProductReviews = async (req, res) => {
    try {
        var id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid product id" })
        }
        var product = await Product.findById(id).select("reviews averageRating numReviews")
        if (!product) {
            return res.status(404).json({ message: "product not found" })
        }
        return res.status(200).json({
            reviews: product.reviews || [],
            averageRating: product.averageRating || 0,
            numReviews: product.numReviews || 0
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "failed to fetch reviews", error: error.message })
    }
}

var addOrUpdateReview = async (req, res) => {
    try {
        var id = req.params.id
        var userId = req.user.userId
        var { rating, comment } = req.body || {}

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid product id" })
        }
        rating = Number(rating)
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "rating must be between 1 and 5" })
        }

        var product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "product not found" })
        }

        if (!Array.isArray(product.reviews)) product.reviews = []

        var existing = product.reviews.find(r => String(r.user) === String(userId))
        if (existing) {
            existing.rating = rating
            existing.comment = typeof comment === "string" ? comment : (existing.comment || "")
        } else {
            product.reviews.push({
                user: String(userId),
                rating,
                comment: typeof comment === "string" ? comment : ""
            })
        }

        product.numReviews = product.reviews.length
        var total = product.reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0)
        product.averageRating = product.numReviews ? Math.round((total / product.numReviews) * 10) / 10 : 0

        await product.save()

        return res.status(200).json({
            message: existing ? "review updated" : "review added",
            averageRating: product.averageRating,
            numReviews: product.numReviews,
            reviews: product.reviews
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "failed to add review", error: error.message })
    }
}

var deleteReview = async (req, res) => {
    try {
        var id = req.params.id
        var reviewId = req.params.reviewId
        var userId = req.user.userId
        var role = req.user.role

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid product id" })
        }

        var product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "product not found" })
        }

        if (!Array.isArray(product.reviews)) product.reviews = []

        var idx = product.reviews.findIndex(r => String(r._id) === String(reviewId))
        if (idx === -1) {
            return res.status(404).json({ message: "review not found" })
        }

        var isOwner = String(product.reviews[idx].user) === String(userId)
        var isAdmin = role === "admin"
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "not allowed to delete this review" })
        }

        product.reviews.splice(idx, 1)

        product.numReviews = product.reviews.length
        var total = product.reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0)
        product.averageRating = product.numReviews ? Math.round((total / product.numReviews) * 10) / 10 : 0

        await product.save()

        return res.status(200).json({
            message: "review deleted",
            averageRating: product.averageRating,
            numReviews: product.numReviews,
            reviews: product.reviews
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "failed to delete review", error: error.message })
    }
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    addNewProduct,
    updateProduct,
    deleteProduct,
    getProductReviews,
    addOrUpdateReview,
    deleteReview
}