"use client";

import { useState } from 'react';

interface UploadResult {
    url: string;
    publicId: string;
    fileName: string;
    fileType: string;
}

interface UseUploadReturn {
    upload: (file: File, folder?: string) => Promise<UploadResult>;
    uploading: boolean;
    progress: number;
    error: string | null;
}

export function useUpload(): UseUploadReturn {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const upload = async (file: File, folder: string = 'player-profiles'): Promise<UploadResult> => {
        // Vercel Serverless Function Limit is 4.5MB for Request Body
        // We set a safe limit of 4MB
        const MAX_SIZE_MB = 4;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            throw new Error(`File size exceeds the ${MAX_SIZE_MB}MB limit. Please compress the file.`);
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            // Determine resource type
            const isVideo = file.type.startsWith('video/');
            const isImage = file.type.startsWith('image/') || file.type === 'application/pdf';
            formData.append('resourceType', isVideo ? 'video' : isImage ? 'image' : 'raw');

            setProgress(30);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            setProgress(80);

            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error("Failed to parse JSON response", e);
                // If response is not JSON, it might be a 413 Payload Too Large HTML response
                if (response.status === 413) {
                    throw new Error(`File is too large (Server Limit). Please use a file smaller than ${MAX_SIZE_MB}MB.`);
                }
                throw new Error(`Upload failed with status ${response.status}`);
            }

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            const result = data;
            setProgress(100);

            return {
                url: result.url,
                publicId: result.publicId,
                fileName: result.fileName,
                fileType: result.fileType,
            };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            console.error("Upload Error:", message);
            setError(message);
            throw err;
        } finally {
            setUploading(false);
        }
    };

    return { upload, uploading, progress, error };
}

// Utility to convert File to base64 for preview
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}
