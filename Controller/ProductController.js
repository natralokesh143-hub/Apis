
// var Product = require("../Model/ProductModel");
// const { uploadToCloudinary } = require("../helper/cloudinaryhelper");
// var mongoose = require("mongoose");

// var {client} = require("../config/redisClient")

// function productErrorResponse(res, error, message) {
//     if (error.name === "CastError") {
//         return res.status(400).json({ message: "invalid product id" });
//     }
//     return res.status(500).json({ message: message, error: error.message });
// }



// var getAllProducts = async (req, res) => {
//     try {
//          var page = parseInt(req.query.page) || 1
//         var limit = parseInt(req.query.limit) || 10
//         var skip = (page-1)*limit

//         var cacheKey = `allproducts:${page}:${limit}`;

//         var cachedData = await client.get(cacheKey);
        

//         if (cachedData) {
//             console.log("data from redis");
//             return res.status(200).json({
//                 products: JSON.parse(cachedData)
//             });
//         }

//         var allProducts = await Product.find();

//         await client.setEx(cacheKey, 3600, JSON.stringify(allProducts));

//         console.log("data from mongo db");

//         res.status(200).json({
//             products: allProducts
//         });

//     } catch (error) {
//         console.log("error", error);
//         return productErrorResponse(res, error, "failed to fetch products");
//     }
// };


// var getSingleProduct = async(req,res)=>{
//     try{
//         var id = req.params.id 
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "invalid product id" });
//         }
//         var cacheKey =    `product:${id}`
//         const cachedData = await client.get(cacheKey);
//         if(cachedData){
//             return res.status(200).json({
//                 singleProduct: JSON.parse(cachedData)
//             });

//         }
//         const singleProduct = await Product.findById(id);
//         if (!singleProduct) {
//             return res.status(404).json({ message: "product not found" });
//         }
//         await client.setEx(cacheKey, 60, JSON.stringify(singleProduct));
//         res.status(200).json({ singleProduct });


//     }catch(error){
//         console.log("error",error);
//         return productErrorResponse(res, error, "failed to fetch product");
//     }
// }



// var addNewProduct = async(req,res)=>{
//     try{

//         var {title,description,price} = req.body
//         if (title === undefined || description === undefined || price === undefined) {
//             return res.status(400).json({ message: "title, description, and price are required" });
//         }
//         if(!req.file){
//             return res.status(400).json({message : "image file is required (form field name: image)"})
//         }
//         // upload to cloudinary
//         var {url,publicId} = await uploadToCloudinary(req.file.path)
//         var newProduct = await Product.create({
//         title,
//         description,
//         price,
//         image : {
//             url,
//             publicId
//         }
//     })
//     await client.del("allproducts");
//     res.status(201).json({message : "productadded",product : newProduct})
//     }catch(error){
//         console.log("error",error);
//         return productErrorResponse(res, error, "failed to add product");
//     }
// }

// var updateProduct = async(req,res)=>{
//     try{
//         var id = req.params.id 
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "invalid product id" });
//         }
//         var {title,description,price} = req.body
//         var update = await Product.findByIdAndUpdate(id,{
//             title,
//             description,
//             price

//         },{
//             new : true
//         })
//         if (!update) {
//             return res.status(404).json({ message: "product not found" });
//         }
//         await client.del("allproducts");
//         await client.del(`product:${id}`);
//         res.status(200).json({message : "product updated",data : update})

//     }catch(error){
//         console.log("error",error);
//         return productErrorResponse(res, error, "failed to update product");
//     }
// }

// var deleteProduct = async(req,res)=>{
//     try{
//         var id = req.params.id 
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "invalid product id" });
//         }
//         var deletePro = await Product.findByIdAndDelete(id)
//         if (!deletePro) {
//             return res.status(404).json({ message: "product not found" });
//         }
//         res.status(200).json({message : "product deleted"})
//         await client.del("allproducts");
//         await client.del(`product:${id}`);

//     }catch(error){
//         console.log("error",error);
//         return productErrorResponse(res, error, "failed to delete product");
//     }
// }
// module.exports = {
//     getAllProducts,getSingleProduct,addNewProduct,updateProduct,deleteProduct
// }



var Product = require("../Model/ProductModel");
const { uploadToCloudinary } = require("../helper/cloudinaryhelper");
var { client } = require("../config/redisClient");

// ================= GET ALL PRODUCTS =================
var getAllProducts = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10;
        var skip = (page - 1) * limit;

        var cacheKey = `allproducts:${page}:${limit}`;

        // 🔹 Check Redis Cache
        if (client.isOpen) {
            var cachedData = await client.get(cacheKey);
            if (cachedData) {
                console.log("✅ Data from Redis");
                return res.status(200).json(JSON.parse(cachedData));
            }
        }

        // 🔹 Fetch from DB
        var totalProducts = await Product.countDocuments();
        var products = await Product.find().skip(skip).limit(limit);

        var response = {
            total: totalProducts,
            page,
            limit,
            totalPages: Math.ceil(totalProducts / limit),
            products
        };

        // 🔹 Store in Redis
        if (client.isOpen) {
            await client.setEx(cacheKey, 3600, JSON.stringify(response));
        }

        console.log("📦 Data from MongoDB");
        res.status(200).json(response);

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Failed to fetch products" });
    }
};

// ================= GET SINGLE PRODUCT =================
var getSingleProduct = async (req, res) => {
    try {
        var id = req.params.id;
        var cacheKey = `product:${id}`;

        // 🔹 Check cache
        if (client.isOpen) {
            var cachedData = await client.get(cacheKey);
            if (cachedData) {
                return res.status(200).json({
                    singleProduct: JSON.parse(cachedData)
                });
            }
        }

        var product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔹 Store in cache
        if (client.isOpen) {
            await client.setEx(cacheKey, 3600, JSON.stringify(product));
        }

        res.status(200).json({ singleProduct: product });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Failed to fetch product" });
    }
};

// ================= ADD PRODUCT =================
var addNewProduct = async (req, res) => {
    try {
        var { title, description, price } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "File missing" });
        }

        // 🔹 Upload image
        var { url, publicId } = await uploadToCloudinary(req.file.path);

        var newProduct = await Product.create({
            title,
            description,
            price,
            image: { url, publicId }
        });

        // 🔹 Clear relevant cache only
        if (client.isOpen) {
            const keys = await client.keys("allproducts:*");
            if (keys.length) await client.del(keys);
        }

        res.status(201).json({
            message: "Product added",
            product: newProduct
        });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Failed to add product" });
    }
};

// ================= UPDATE PRODUCT =================
var updateProduct = async (req, res) => {
    try {
        var id = req.params.id;
        var { title, description, price } = req.body;

        var updatedProduct = await Product.findByIdAndUpdate(
            id,
            { title, description, price },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔹 Clear cache
        if (client.isOpen) {
            await client.del(`product:${id}`);

            const keys = await client.keys("allproducts:*");
            if (keys.length) await client.del(keys);
        }

        res.status(200).json({
            message: "Product updated",
            product: updatedProduct
        });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Failed to update product" });
    }
};

// ================= DELETE PRODUCT =================
var deleteProduct = async (req, res) => {
    try {
        var id = req.params.id;

        var deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔹 Clear cache
        if (client.isOpen) {
            await client.del(`product:${id}`);

            const keys = await client.keys("allproducts:*");
            if (keys.length) await client.del(keys);
        }

        res.status(200).json({
            message: "Product deleted"
        });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Failed to delete product" });
    }
};

// ================= EXPORT =================
module.exports = {
    getAllProducts,
    getSingleProduct,
    addNewProduct,
    updateProduct,
    deleteProduct
};