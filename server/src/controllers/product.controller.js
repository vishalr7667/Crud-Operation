import ApiError from "../utils/apiError.js";
import { Product } from "../models/product.model.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addProduct = asyncHandler(async(req, res) => {
    try {
        const {name, price, description, category, stock, createdBy} = req.body;    
        if ([name, price, description, category, stock, createdBy].some(field => field === "")) {
            return res.status(400).json(new ApiError(400, "All fields are required"))
        }
    
        const image = req.file?.path;
        if (!image) {
            return res.status(400).json(new ApiError(400, "Image is required"))
        }
    
        const uploadResponse = await uploadOnCloudinary(image);
        if (!uploadResponse) {
            return res.status(400).json(new ApiError(400, "Image upload failed"))
        }
    
        const product = await Product.create({
            name, price, description, category, stock, createdBy : req.user._id, image: uploadResponse.url
        })
    
        if (!product) {
            return res.status(400).json(new ApiError(400, "Product creation failed"))
        }
    
        return res.status(201).json(new ApiResponse(201, "Product created successfully", product))
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message))
    }
});

const viewProducts = asyncHandler(async(req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        console.log(page, limit);
        
        const products = await Product.paginate({createdBy: req.user?._id},{page, limit});
        return res.status(200).json(new ApiResponse(200, "Products fetched successfully", products))
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message))
    }
})

const getProductById = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json(new ApiError(400, "Product id is required"))
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"))
        }
        return res.status(200).json(new ApiResponse(200, "Product fetched successfully", product))
    } catch (error) {
       return res.status(500).json(new ApiError(500, error.message))
    }
})

const updateProduct = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json(new ApiError(400, "Product id is required"))
        }

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return res.status(404).json(new ApiError(404, "Product not found"))
        }

        const oldImage = existingProduct.image;
        const oldImagePublicId = oldImage.split("/").pop().split(".")[0];
        console.log("oldImagePublicId", oldImagePublicId);
        
        const {name, price, description, category, stock} = req.body;

        let image = oldImage;
        
        if (req.file?.path) {
            const uploadResponse = await uploadOnCloudinary(req.file.path);
            if (!uploadResponse) {
                return res.status(500).json(new ApiError(500, "Image upload failed"))
            }
            image = uploadResponse.url;

            if (oldImage && typeof oldImage === "string") {
                const deleteResponse = await deleteFromCloudinary(oldImagePublicId);
                if (!deleteResponse) {
                    return res.status(500).json(new ApiError(500, "Image delete failed"))
                }
            }
        }
        const product = await Product.findByIdAndUpdate(id, {
            $set: {
                ...(typeof name !== "undefined" && {name}),
                ...(typeof price !== "undefined" && {price}),
                ...(typeof description !== "undefined" && {description}),
                ...(typeof category !== "undefined" && {category}),
                ...(typeof stock !== "undefined" && {stock}),
                image
            }
        }, {new: true});

        
        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"))
        }
        return res.status(200).json(new ApiResponse(200, "Product updated successfully", product))
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message))
    }
})

const deleteProduct = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;

         // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(new ApiError(400, "Invalid product ID"));
        }

        if (!id) {
            return res.status(400).json(new ApiError(400, "Product id is required"))
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"))
        }

        const OldImagePath = product.image.split("/").pop().split(".")[0];

        const deleteResponse = await deleteFromCloudinary(OldImagePath);
        if (!deleteResponse) {
            return res.status(500).json(new ApiError(500, "Image delete failed"))
        }

        await Product.findByIdAndDelete(id);

        return res.status(200).json(new ApiResponse(200, "Product deleted successfully"))

    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || 'Something went wrong'))
    }
})


export {addProduct, viewProducts, getProductById, updateProduct, deleteProduct};