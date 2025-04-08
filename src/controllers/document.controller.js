import * as documentService from "../service/document.service.js";
import { uploadDocumentToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const uploadDocument = async (req, res) => {
  try {
    const { productId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const product = await documentService.getProductById(productId);
    if (product?.warrantyDocUrl) {
      return res.status(409).json({ message: "Document already exists. Please delete it before uploading a new one." });
    }

    const cloudinaryUrl = await uploadDocumentToCloudinary(file, productId);

    const updatedProduct = await documentService.updateWarrantyDocUrl(productId, cloudinaryUrl);

    res.status(200).json({ message: "Document uploaded successfully", product: updatedProduct });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload document" });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const userId = req.user.uid;
    const documents = await documentService.getAllDocuments(userId);
    res.status(200).json(documents);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await documentService.getProductById(productId);

    if (!product || !product.warrantyDocUrl) {
      return res.status(404).json({ message: "Document not found" });
    }

    await deleteFromCloudinary(productId);
    await documentService.removeWarrantyDocUrl(productId);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};
