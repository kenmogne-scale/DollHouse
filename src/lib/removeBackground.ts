"use client";

import { removeBackground as removeBg } from "@imgly/background-removal";

let isModelLoaded = false;

/**
 * Removes the background from an image file and returns a PNG blob with transparency.
 * Uses @imgly/background-removal which runs entirely in the browser using WebGL/WASM.
 * 
 * @param file - The image file to process
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns A Blob containing the PNG image with transparent background
 */
export async function removeImageBackground(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Create a blob URL for the file
  const imageUrl = URL.createObjectURL(file);

  try {
    // Remove background - the library handles model loading automatically
    const result = await removeBg(imageUrl, {
      progress: (key, current, total) => {
        if (onProgress) {
          // Calculate overall progress
          const progressPercent = Math.round((current / total) * 100);
          onProgress(progressPercent);
        }
        
        // Track if model is loaded
        if (key === "compute:inference" && current === total) {
          isModelLoaded = true;
        }
      },
      // Use default model which works well for clothing
      model: "medium",
      // Output as PNG with transparency
      output: {
        format: "image/png",
        quality: 0.9,
      },
    });

    return result;
  } finally {
    // Clean up blob URL
    URL.revokeObjectURL(imageUrl);
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
 * Check if the model has been loaded (useful for showing loading state)
 */
export function isBackgroundRemovalModelLoaded(): boolean {
  return isModelLoaded;
}


