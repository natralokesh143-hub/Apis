var User = require("../Model/UserModel")
var Product = require("../Model/ProductModel")

var getWishlist = async (req, res) => {
    try {
        var userId = req.user.userId
        var user = await User.findById(userId).select("wishlist")
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        var wishlistIds = Array.isArray(user.wishlist) ? user.wishlist : []
        var products = await Product.find({ _id: { $in: wishlistIds } })

        return res.status(200).json({
            wishlist: wishlistIds,
            products
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "failed to fetch wishlist", error: error.message })
    }
}

var addToWishlist = async (req, res) => {
    try {
        var userId = req.user.userId
        var { productId } = req.body || {}

        if (!productId) {
            return res.status(400).json({
                message: "productId is required",
                example: { productId: "PRODUCT_ID_HERE" }
            })
        }

        var exists = await Product.findById(productId).select("_id")
        if (!exists) {
            return res.status(404).json({ message: "product not found" })
        }

        var user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        if (!Array.isArray(user.wishlist)) user.wishlist = []
        if (!user.wishlist.includes(String(productId))) {
            user.wishlist.push(String(productId))
            await user.save()
        }

        return res.status(200).json({ message: "added to wishlist", wishlist: user.wishlist })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "failed to add to wishlist", error: error.message })
    }
}

var removeFromWishlist = async (req, res) => {
    try {
        var userId = req.user.userId
        var productId = req.params.productId

        if (!productId) {
            return res.status(400).json({ message: "productId is required" })
        }

        var user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        if (!Array.isArray(user.wishlist)) user.wishlist = []
        user.wishlist = user.wishlist.filter(id => String(id) !== String(productId))
        await user.save()

        return res.status(200).json({ message: "removed from wishlist", wishlist: user.wishlist })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "failed to remove from wishlist", error: error.message })
    }
}

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
}

