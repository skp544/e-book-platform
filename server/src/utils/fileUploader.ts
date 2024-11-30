import s3Client from "@/cloud/aws";
import cloudinary from "@/cloud/cloudinary";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { File } from "formidable";

export const updateAvatarToCloudinary = async (
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

export const updateAvatarToAWS = async (
  file: File,
  uniqueFileName: string,
  avatarId?: string
) => {
  const bucketName = "e-book-public-data";

  if (avatarId) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: avatarId,
    });

    await s3Client.send(deleteCommand);
  }
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: fs.readFileSync(file.filepath),
  });

  await s3Client.send(putCommand);

  return {
    id: uniqueFileName,
    url: `https://${bucketName}.s3.amazonaws.com/${uniqueFileName}`,
  };
};
