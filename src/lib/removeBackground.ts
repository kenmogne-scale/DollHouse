"use client";

/**
 * Removes the background from an image file using Remove.bg API.
 * 
 * @param file - The image file to process
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns A Blob containing the PNG image with transparent background
 */
export async function removeImageBackground(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    // Start progress
    if (onProgress) {
      onProgress(10);
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("image", file);

    // Update progress
    if (onProgress) {
      onProgress(30);
    }

    // Call our API route
    const response = await fetch("/api/remove-background", {
      method: "POST",
      body: formData,
    });

    // Update progress
    if (onProgress) {
      onProgress(80);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || "Failed to remove background");
    }

    // Get the processed image blob
    const blob = await response.blob();

    // Complete progress
    if (onProgress) {
      onProgress(100);
    }

    return blob;
  } catch (error) {
    console.error("Error removing background:", error);
    throw error;
  }
}

/**
 * Converts a Blob to a Data URL string
 */
export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a Blob to a File object
 */
export function blobToFile(blob: Blob, originalFileName: string): File {
  // Change extension to .png
  const baseName = originalFileName.replace(/\.[^.]+$/, "");
  const newFileName = `${baseName}.png`;
  
  return new File([blob], newFileName, { type: "image/png" });
}

/**
 * Check if the background removal service is available
 */
export function isBackgroundRemovalModelLoaded(): boolean {
  return true; // API is always "loaded"
}
