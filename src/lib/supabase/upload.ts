import { supabase } from "./client";

type UploadOptions = {
  bucket: string;
  folder?: string;
  fileCategory: "image" | "document";
  makePublic?: boolean;
  maxSizeMB?: number;
};

export async function uploadFile(
  file: File,
  options: UploadOptions
) {
  const {
    bucket,
    folder = "",
    fileCategory,
    makePublic = true,
    maxSizeMB = 5,
  } = options;

  const allowedTypes =
    fileCategory === "image"
      ? ACCEPTED_IMAGE_TYPES
      : ACCEPTED_DOCUMENT_TYPES;

  // Validate type
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File type not allowed");
  }

  // Validate size
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File exceeds ${maxSizeMB}MB`);
  }

  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (makePublic) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { path: filePath, url: data.publicUrl };
  }

  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 60);

  return { path: filePath, url: data!.signedUrl };
}

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
