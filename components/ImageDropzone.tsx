"use client";

import React, { useState } from "react";

interface Uploaded {
  file: File | null;
  downloadUrl: string;
  filename: string;
  state: "pending" | "complete" | "error";
}

type ImageDropzoneProps = {
  onFilesAdded?: (addedFiles: string[]) => Promise<void>;
  onFileDeleted?: (publicId: string) => void;
  photos?: string[];
};

export default function ImageDropzone({
  photos,
  onFilesAdded,
  onFileDeleted,
}: ImageDropzoneProps) {
  const [imagesStates, setImagesStates] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return <div>ImageDropzone</div>;
}
