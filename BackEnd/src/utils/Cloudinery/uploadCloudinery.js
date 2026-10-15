 import fs from "fs";
 import { v2 as cloudinary } from "cloudinary";


export const uploadOnCloudinery = async (localfilepath) => {
  try {
    if (!localfilepath) return;
    if (
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn("Cloudinary credentials not provided. Using default image.");
      if (fs.existsSync(localfilepath)) {
        fs.unlinkSync(localfilepath);
      }
      return {
        secure_url:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        url:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      };
    }
    const response = await cloudinary.uploader.upload(localfilepath, {
      folder: "Event_Management_System",
      resource_type: "image",
    });
    if (fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }
    return response;
  } catch (error) {
    if (fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }
    console.error("Cloudinary upload failed, falling back to default image:", error.message);
    return {
      secure_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    };
  }
};