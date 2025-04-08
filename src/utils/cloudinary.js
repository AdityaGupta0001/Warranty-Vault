import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file to Cloudinary
export const uploadToCloudinary = (file, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profile_pictures",
        public_id: publicId,
        transformation: [
          { width: 500, height: 500, crop: "thumb", gravity: "face", radius: "max" }, // Face-centered and rounded
          { fetch_format: "auto", quality: "auto" } // Optimize image
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const uploadDocumentToCloudinary = (file, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // for non-images like PDFs
        folder: "warranty_docs",
        public_id: publicId,
        format: "pdf",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary PDF upload error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const deleteFromCloudinary = (productId) => {
  return cloudinary.uploader.destroy(`warranty_docs/${productId}.pdf`, { resource_type: "raw" });
};

