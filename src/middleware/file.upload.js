import multer from 'multer';

const upload = multer({
  limits: { fileSize: 500 * 1024 }, // 500KB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const uploadFile = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF, JPG, and PNG files are allowed!"), false);
    }
    
    cb(null, true);
  }
});

const pdfUpload = multer({
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

export {upload, uploadFile, pdfUpload};
