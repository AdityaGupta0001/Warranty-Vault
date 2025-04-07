import * as productService from "../service/product.service.js";
import { extractDataFromPDF } from "../utils/ocr.js";

export const addProduct = async (req, res) => {
    try {
        const userId = req.user.uid;
        let productData;

        if (req.file) {
            console.log("Processing file upload...");
            const extractedData = await extractDataFromPDF(req.file);
            
            if (!extractedData) {
                return res.status(400).json({ error: "Failed to extract data from PDF" });
            }
            productData = extractedData;
        } else {
            console.log("Processing manual entry...");
            productData = req.body;
        }

        productData.userId = userId;

        const newProduct = await productService.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Failed to add product" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getUserProducts(req.user.uid);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.productId);
        if (!product){ 
            return res.status(404).json({ error: "Product not found" });
        }
        if (product.userId !== req.user.uid) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (product.userId !== req.user.uid) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const updatedProduct = await productService.updateProductById(req.params.productId, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (product.userId !== req.user.uid) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        await productService.deleteProductById(req.params.productId);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};
