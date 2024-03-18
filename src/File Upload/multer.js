import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { AppError } from "../utils/AppError.js";

function multerRefactor(folderName) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype === "application/pdf" // Allow PDF files
    ) {
      cb(null, true);
    } else {
      cb(new AppError("Only images, videos, and PDFs are allowed"));
    }
  }

  let upload = multer({ storage, fileFilter });
  return upload;
}

const uploadSingleFile = (fieldName, folderName) => {
  return multerRefactor(folderName).single(fieldName);
};

const uploadMixedFiles = (arrayOfFields, folderName) => {
  return multerRefactor(folderName).fields(arrayOfFields);
};
export { uploadSingleFile, uploadMixedFiles };
