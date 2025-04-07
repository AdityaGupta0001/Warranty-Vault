import express from "express";
import { verifyToken } from "../middleware/verify.jwt.js";
import * as productController from "../controllers/product.controller.js";
import { uploadFile } from "../middleware/file.upload.js";

const router = express.Router();

router.post("/api/products/add-product", verifyToken, uploadFile.single("document"), productController.addProduct);
router.get("/api/products/get-all-products", verifyToken, productController.getAllProducts);
router.get("/api/products/get-product/:productId", verifyToken, productController.getProduct);
router.put("/api/products/update-product/:productId", verifyToken, productController.updateProduct);
router.delete("/api/products/delete-product/:productId", verifyToken, productController.deleteProduct);

export { router as productRouter };
