const cloudinary = require("../../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "tiffins" },
      (error, uploadResult) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        return res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: uploadResult.secure_url,
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };
