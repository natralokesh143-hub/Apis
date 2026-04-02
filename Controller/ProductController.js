
const fs = require("fs");
var Product = require("../Model/ProductModel");
const { uploadToCloudinary, deleteFromCloudinary } = require("../helper/cloudinaryhelper");





var getAllProducts = async(req,res)=>{
    try{
        var allProducts =  await Product.find()
        console.log(req.user);
        res.status(200).json({products: allProducts})

    }catch(error){
        console.log("error",error);
    }
}


var getSingleProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var singleProduct = await  Product.findById(id)
        res.status(200).json({singleProduct})

    }catch(error){
        console.log("error",error);
    }
}

var addNewProduct = async(req,res)=>{
    try{
        var {title,description,price} = req.body
        if(!req.file){
            return res.status(400).json({message : "Image file is required"})
        }

        var {url,publicId} = await uploadToCloudinary(req.file.path)
        await fs.promises.unlink(req.file.path).catch(()=>{})

        var newProduct = await Product.create({
            title,
            description,
            price,
            image : {
                url,
                publicId
            }
        })
        res.status(201).json({message : "product added",product : newProduct})
    }catch(error){
        console.log("error",error);
        res.status(500).json({message: "Failed to add product"})
    }
}

var updateProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var {title,description,price} = req.body

        var existingProduct = await Product.findById(id)
        if(!existingProduct){
            return res.status(404).json({message: "Product not found"})
        }

        var updateData = {
            title: title ?? existingProduct.title,
            description: description ?? existingProduct.description,
            price: price ?? existingProduct.price
        }

        if(req.file){
            if(existingProduct.image?.publicId){
                await deleteFromCloudinary(existingProduct.image.publicId)
            }
            var {url,publicId} = await uploadToCloudinary(req.file.path)
            await fs.promises.unlink(req.file.path).catch(()=>{})
            updateData.image = {url,publicId}
        }

        var update = await Product.findByIdAndUpdate(id, updateData,{
            new : true
        })
        res.status(200).json({message : "product updated",data : update})

    }catch(error){
        console.log("error",error);
        res.status(500).json({message: "Failed to update product"})
    }
}

var deleteProduct = async(req,res)=>{
    try{
        var id = req.params.id 
        var existingProduct = await Product.findById(id)
        if(!existingProduct){
            return res.status(404).json({message: "Product not found"})
        }

        if(existingProduct.image?.publicId){
            await deleteFromCloudinary(existingProduct.image.publicId)
        }

        await Product.findByIdAndDelete(id)
        res.status(200).json({message : "product deleted"})

    }catch(error){
        console.log("error",error);
        res.status(500).json({message: "Failed to delete product"})
    }
}
module.exports = {
    getAllProducts,getSingleProduct,addNewProduct,updateProduct,deleteProduct
}