import express from "express";
import { verifyToken } from "../middleware/verify.jwt.js";
import * as scraperController from "../controllers/scraper.controller.js";
const router = express.Router();

router.get("/api/scraper/amazon", verifyToken, scraperController.scrapeAmazonProduct);

export { router as scraperRouter };