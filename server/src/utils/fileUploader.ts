import s3Client from "@/cloud/aws";
import cloudinary from "@/cloud/cloudinary";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { File } from "formidable";
import path from "path";
import { generateS3ClientPublicUrl } from "./helper";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    url: generateS3ClientPublicUrl(bucketName, uniqueFileName),
  };
};

export const uploadCoverToCloudinary = async (file: File) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.filepath
  );

  return { id: public_id, url: secure_url };
};

export const uploadBookToLocalDir = async (
  file: File,
  uniqueFileName: string
) => {
  const bookStoragePath = path.join(__dirname, "../books");

  if (!fs.existsSync(bookStoragePath)) {
    fs.mkdirSync(bookStoragePath);
  }

  const filePath = path.join( bookStoragePath, uniqueFileName);

  fs.writeFileSync(filePath, fs.readFileSync(file.filepath));
};

export const uploadBookToAWS = async (
  filePath: string,
  uniqueFileName: string
) => {
  const bucketName = process.env.AWS_BUCKET_NAME!;

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: fs.readFileSync(filePath),
  });

  await s3Client.send(putCommand);

  return {
    id: uniqueFileName,
    url: generateS3ClientPublicUrl(bucketName, uniqueFileName),
  };
};

interface FileInfo {
  bucket: string;
  uniqueKey: string;
  contentType: string;
}

export const generateFileUploadUrl = async (
  client: S3Client,
  fileInfo: FileInfo
) => {
  const { bucket, uniqueKey, contentType } = fileInfo;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: uniqueKey,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command);
};
