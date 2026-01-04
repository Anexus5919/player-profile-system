import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const uploadToCloudinary = async (
    file: string, // base64 data URL or file path
    folder: string = 'player-profiles',
    resourceType: 'image' | 'video' | 'auto' | 'raw' = 'auto'
): Promise<{ url: string; publicId: string }> => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: resourceType,
            transformation: resourceType === 'image' ? [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ] : undefined,
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};
