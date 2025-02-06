 // Found in Cloudinary dashboard

import { env } from "@/constants/envValues";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/upload`;

export const uploadImageToCloudinary = async (imageUri:string) => {
  try {
    // Convert image URI to Blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Generate a random 10-digit alphanumeric string
    const randomString = Math.random().toString(36).substring(2, 12);
    const modifiedFileName = `profile_${randomString}.jpg`;

    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", blob, modifiedFileName);
    formData.append("upload_preset", env.UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // Cloudinary returns the URL of the uploaded image
  } catch (error) {
    console.error("Upload failed:", error instanceof Error ? error.message : error);
    return null;
  }
};
