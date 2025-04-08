// document.router.js
import express from "express";
import { verifyToken } from "../middleware/verify.jwt.js";
import { pdfUpload } from "../middleware/file.upload.js";
import * as documentController from "../controllers/document.controller.js";

const router = express.Router();

router.post("/api/documents/upload/:productId", verifyToken, pdfUpload.single("file"), documentController.uploadDocument);
router.get("/api/documents/get-all-documents", verifyToken, documentController.getAllDocuments);
router.delete("/api/documents/:productId", verifyToken, documentController.deleteDocument);

export { router as documentRouter };
