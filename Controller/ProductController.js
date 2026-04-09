
var Product = require("../Model/ProductModel");
const { uploadToCloudinary } = require("../helper/cloudinaryhelper");





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
module.exports = {
    getAllProducts,getSingleProduct,addNewProduct,updateProduct,deleteProduct
}