import * as FileSystem from "expo-file-system";
import { env } from "@/constants/envValues";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/upload`;

export const uploadImageToCloudinary = async (imageUri: string) => {
  try {
    // Read file as a base64 string
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Generate a random 10-digit alphanumeric string
    const randomString = Math.random().toString(36).substring(2, 12);
    const modifiedFileName = `campus_hub_${randomString}.jpg`;

    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${base64}`);
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
