import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { addProduct, viewProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const productRouter = Router();

productRouter.route('/view-products').get(verifyJwt, viewProducts);
productRouter.route('/:id').get(verifyJwt, getProductById);
productRouter.route('/add-product').post(verifyJwt, upload.single('image'), addProduct)
productRouter.route('/:id').put(verifyJwt, upload.single('image'), updateProduct)
productRouter.route('/:id').delete(verifyJwt, deleteProduct)

export default productRouter;
