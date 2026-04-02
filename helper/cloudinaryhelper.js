var cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(filepath) {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            folder: "uploads"
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Image upload failed");
    }
}

async function deleteFromCloudinary(publicId) {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        throw new Error("Image delete failed");
    }
}

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};