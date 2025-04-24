import * as scraperService from "../service/scraper.service.js";
export const scrapeAmazonProduct = async (req, res) => {
    try {
        const { url } = req.body;
        const data = await scraperService.getAmazonProductData(req.user.uid, url);
        if (!data) {
            return res.status(404).json({ error: "Data not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch product details" });
    }
};