 // Found in Cloudinary dashboard

import { env } from "@/constants/envValues";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/image/upload`;

const uploadImageToCloudinary = async (imageUri: string, folder: string = "") => {
  try {
    // Convert image URI to Blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Generate a random 10-digit alphanumeric string for the file name
    const randomString = Math.random().toString(36).substring(2, 12);
    const fileName = folder ? `${folder}/${randomString}.jpg` : `${randomString}.jpg`; // Include folder path for post images

    // Create FormData for the POST request
    const formData = new FormData();
    formData.append("file", blob, fileName);
    formData.append("upload_preset", env.UPLOAD_PRESET);
    if (folder) formData.append("folder", folder); // Add folder only for post images

    // Upload image to Cloudinary
    console.log("from here: ", env.UPLOAD_PRESET)
    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url; // Cloudinary returns the URL of the uploaded image
    } else {
      throw new Error("Failed to upload image to Cloudinary");
    }
  } catch (error) {
    console.error("Upload failed:", error instanceof Error ? error.message : error);
    return null;
  }
};

export const uploadProfileImageToCloudinary = async (imageUri: string, folder:string = "profile_pictures") => {
  return uploadImageToCloudinary(imageUri, folder); // No need for duplication, we reuse the common function
};

export const uploadPostImageToCloudinary = async (imageUri: string, folder: string = "posts") => {
  return uploadImageToCloudinary(imageUri, folder); // Reuse the common function with folder parameter
};


