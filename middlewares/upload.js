const multer = require('multer');

// Option 1: Use memory storage if you plan to upload to Cloudinary or external service
const storage = multer.memoryStorage();

// Option 2: Use disk storage to save files locally (uncomment if needed)
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Create this folder manually
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
*/

const upload = multer({ storage });

module.exports = upload;
