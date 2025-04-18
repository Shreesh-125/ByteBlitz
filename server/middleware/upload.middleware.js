import upload from '../config/multer.config.js';
import AppError from '../utils/AppError.js';

export const handleProfilePicUpload = (req, res, next) => {
  const uploadSingle = upload.single('profilePic');

  uploadSingle(req, res, (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }
    next();
  });
};