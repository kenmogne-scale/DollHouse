"use client";

/**
 * Removes the background from an image file and returns a PNG blob with transparency.
 * 
 * NOTE: Background removal is temporarily disabled for deployment compatibility.
 * The original image is returned as-is.
 * 
 * @param file - The image file to process
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns A Blob containing the image (original, without background removal)
 */
export async function removeImageBackground(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Simulate progress for UI feedback
  if (onProgress) {
    onProgress(50);
    await new Promise(resolve => setTimeout(resolve, 100));
    onProgress(100);
  }
  
  // Return original file as blob (background removal disabled)
  return file;
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
  // Keep original extension since we're not processing
  return new File([blob], originalFileName, { type: blob.type || "image/png" });
}

/**
 * Check if the model has been loaded (useful for showing loading state)
 */
export function isBackgroundRemovalModelLoaded(): boolean {
  return true; // Always return true since we're not using the model
}
