
var Product = require("../Model/ProductModel");
const { uploadToCloudinary } = require("../helper/cloudinaryhelper");
var mongoose = require("mongoose");

var {client} = require("../config/redisClient")

function productErrorResponse(res, error, message) {
    if (error.name === "CastError") {
        return res.status(400).json({ message: "invalid product id" });
    }
    return res.status(500).json({ message: message, error: error.message });
}



var getAllProducts = async (req, res) => {
    try {
        var cacheKey = "allproducts";

        var cachedData = await client.get(cacheKey);

        if (cachedData) {
            console.log("data from redis");
            return res.status(200).json({
                products: JSON.parse(cachedData)
            });
        }

        var allProducts = await Product.find();

        await client.setEx(cacheKey, 3600, JSON.stringify(allProducts));

        console.log("data from mongo db");

        res.status(200).json({
            products: allProducts
        });

    } catch (error) {
        console.log("error", error);
        return productErrorResponse(res, error, "failed to fetch products");
    }
};


var getSingleProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid product id" });
        }
        var cacheKey =    `product:${id}`
        const cachedData = await client.get(cacheKey);
        if(cachedData){
            return res.status(200).json({
                singleProduct: JSON.parse(cachedData)
            });

        }
        const singleProduct = await Product.findById(id);
        if (!singleProduct) {
            return res.status(404).json({ message: "product not found" });
        }
        await client.setEx(cacheKey, 60, JSON.stringify(singleProduct));
        res.status(200).json({ singleProduct });


    }catch(error){
        console.log("error",error);
        return productErrorResponse(res, error, "failed to fetch product");
    }
}



var addNewProduct = async(req,res)=>{
    try{

        var {title,description,price} = req.body
        if (title === undefined || description === undefined || price === undefined) {
            return res.status(400).json({ message: "title, description, and price are required" });
        }
        if(!req.file){
            return res.status(400).json({message : "image file is required (form field name: image)"})
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
    await client.del("allproducts");
    res.status(201).json({message : "productadded",product : newProduct})
    }catch(error){
        console.log("error",error);
        return productErrorResponse(res, error, "failed to add product");
    }
}

var updateProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid product id" });
        }
        var {title,description,price} = req.body
        var update = await Product.findByIdAndUpdate(id,{
            title,
            description,
            price

        },{
            new : true
        })
        if (!update) {
            return res.status(404).json({ message: "product not found" });
        }
        await client.del("allproducts");
        await client.del(`product:${id}`);
        res.status(200).json({message : "product updated",data : update})

    }catch(error){
        console.log("error",error);
        return productErrorResponse(res, error, "failed to update product");
    }
}

var deleteProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid product id" });
        }
        var deletePro = await Product.findByIdAndDelete(id)
        if (!deletePro) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).json({message : "product deleted"})
        await client.del("allproducts");
        await client.del(`product:${id}`);

    }catch(error){
        console.log("error",error);
        return productErrorResponse(res, error, "failed to delete product");
    }
}
module.exports = {
    getAllProducts,getSingleProduct,addNewProduct,updateProduct,deleteProduct
}
