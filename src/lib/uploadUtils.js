/**
 * Upload utilities for direct S3 uploads using presigned URLs
 */

import { apiCall } from "./apiClient";

const backendUrl = process.env.VITE_API_URL || "http://localhost:3000";

/**
 * Generate presigned URLs from backend
 * @param {Object} params - Parameters for generating presigned URLs
 * @param {string} params.folder - S3 folder path
 * @param {number} params.count - Number of URLs to generate
 * @param {string} params.contentType - MIME type
 * @returns {Promise<Array>} Array of presigned URL objects
 */
export const generatePresignedUrls = async ({ folder, count, contentType }) => {
  try {
    const response = await apiCall(`${backendUrl}/api/upload/presigned-urls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        folder,
        count,
        contentType,
        expiresIn: 600, // 10 minutes
      }),
    });

    return response.data.urls;
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    throw new Error(`Failed to generate upload URLs: ${error.message}`);
  }
};

/**
 * Upload a file directly to S3 using presigned URL
 * @param {File} file - File to upload
 * @param {string} uploadUrl - Presigned URL from backend
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<void>}
 */
export const uploadToS3 = async (file, uploadUrl, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to network error"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was cancelled"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("x-amz-acl", "public-read"); // Match the ACL from presigned URL
    xhr.send(file);
  });
};

/**
 * Upload multiple files to S3 with progress tracking
 * @param {Array<File>} files - Array of files to upload
 * @param {string} folder - S3 folder path
 * @param {Function} onProgress - Progress callback for all uploads (optional)
 * @returns {Promise<Array>} Array of upload results with public URLs
 */
export const uploadMultipleFiles = async (files, folder, onProgress) => {
  if (!files || files.length === 0) {
    return [];
  }

  try {
    // Step 1: Generate presigned URLs individually for each file with its specific content type
    const presignedUrlPromises = files.map((file) =>
      generatePresignedUrls({
        folder,
        count: 1,
        contentType: file.type, // Each file gets its own content type
      }).then((urls) => urls[0]) // Extract single URL from array
    );

    const presignedUrls = await Promise.all(presignedUrlPromises);

    // Step 2: Upload each file to S3
    const uploadPromises = files.map(async (file, index) => {
      const { uploadUrl, publicUrl, key } = presignedUrls[index];

      try {
        // Upload with individual progress tracking
        await uploadToS3(file, uploadUrl, (progress) => {
          if (onProgress) {
            onProgress(index, progress);
          }
        });

        return {
          success: true,
          url: publicUrl,
          key,
          file,
          error: null,
        };
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return {
          success: false,
          url: null,
          key: null,
          file,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error in uploadMultipleFiles:", error);
    throw error;
  }
};

/**
 * Upload a single media file (image or video) with metadata
 * @param {File} file - File to upload
 * @param {string} folder - S3 folder path
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadMediaFile = async (file, folder, onProgress) => {
  const results = await uploadMultipleFiles([file], folder, (index, progress) => {
    if (onProgress) {
      onProgress(progress);
    }
  });

  return results[0];
};

export default {
  generatePresignedUrls,
  uploadToS3,
  uploadMultipleFiles,
  uploadMediaFile,
};
