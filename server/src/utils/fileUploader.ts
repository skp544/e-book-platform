import cloudinary from "@/cloud/cloudinary";
import { Request } from "express";
import { File } from "formidable";

export const uploadAvatarToCloudinary = async (
  file: File,
  avatarId?: string
) => {
  if (avatarId) {
    await cloudinary.uploader.destroy(avatarId);
  }

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    file.filepath,
    {
      width: 300,
      height: 300,
      crop: "fill",
      gravity: "face",
    }
  );

  return { id: public_id, url: secure_url };
};
