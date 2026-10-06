import {api, APIError} from "encore.dev/api";
import busboy from "busboy";
import {profilePictures, UserDB} from "../encore.service";
import path from "path";
import {getAuthData} from "~encore/auth";
import log from "encore.dev/log";

// Define allowed image MIME types
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Function to validate MIME type
function isValidImageType(mimeType: string): boolean {
    return ALLOWED_MIME_TYPES.includes(mimeType);
}

// Helper function to get user from database
async function getUserById(userId: string) {
    const user = await UserDB.queryRow`
        SELECT *
        FROM "user"
        WHERE id = ${userId}
    `;

    if (!user) {
        throw APIError.notFound(`User with ID ${userId} not found`);
    }

    return user;
}

/**
 * Upload profile picture endpoint
 * Handles file upload, validates image, stores in bucket, and updates user record
 */
export const uploadProfilePicture = api.raw(
    {
        expose: true,
        method: "POST",
        path: "/user/profile-picture",
        bodyLimit: 10485760,
        auth: true,
    },
    async (req, res) => {
        try {
            // Get authenticated user ID from Encore's handler context
            const auth = getAuthData();
            if (!auth) {
                res.writeHead(401, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "Unauthorized"}));
                return;
            }

            const userId = auth.userID;

            // Get user information
            const user = await getUserById(userId);

            // Setup for file upload handling
            const bb = busboy({
                headers: req.headers,
                limits: {
                    files: 1,
                    fileSize: MAX_FILE_SIZE
                },
            });

            let fileData: Buffer | null = null;
            let fileName = "";
            let fileType = "";
            let error: Error | null = null;

            // Handle file data
            bb.on("file", (_, file, info) => {
                const {filename, mimeType} = info;

                // Validate MIME type
                if (!isValidImageType(mimeType)) {
                    error = new Error(`Invalid file type: ${mimeType}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`);
                    file.resume();
                    return;
                }

                fileType = mimeType;

                // Generate a unique filename with timestamp to prevent caching issues
                const fileExt = path.extname(filename) || `.${mimeType.split("/")[1]}`;
                const timestamp = Date.now();
                fileName = `${userId}_${timestamp}${fileExt}`;

                const chunks: Buffer[] = [];
                let fileSize = 0;

                file.on("data", (data) => {
                    fileSize += data.length;

                    // Check file size during upload
                    if (fileSize > MAX_FILE_SIZE) {
                        error = new Error(`File size exceeds maximum allowed size (10MB)`);
                        file.resume();
                        return;
                    }

                    chunks.push(data);
                });

                file.on("close", () => {
                    if (!error) {
                        fileData = Buffer.concat(chunks);
                    }
                });
            });

            // Handle file upload completion
            bb.on("close", async () => {
                if (error) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({error: error.message}));
                    return;
                }

                if (!fileData) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({error: "No file uploaded"}));
                    return;
                }

                try {
                    // If user already has an image, remove it
                    if (user.image) {
                        try {
                            // Extract the existing image key from the image URL or path
                            const imageKey = path.basename(user.image);
                            if (await profilePictures.exists(imageKey)) {
                                await profilePictures.remove(imageKey);
                            }
                        } catch (deleteError) {
                            // Log the error but continue with the upload
                            log.error("Failed to delete old profile picture", deleteError);
                        }
                    }

                    // Upload new image to bucket
                    await profilePictures.upload(fileName, fileData, {
                        contentType: fileType,
                    });

                    // Update user record with new image
                    await UserDB.exec`
                        UPDATE "user"
                        SET "image"     = ${fileName},
                            "updatedAt" = CURRENT_TIMESTAMP
                        WHERE id = ${userId}
                    `;

                    // Generate a signed URL for immediate use
                    const signedUrl = await profilePictures.signedDownloadUrl(fileName, {
                        ttl: 3600 // 1 hour
                    });

                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({
                        success: true,
                        message: "Profile picture updated successfully",
                        filename: fileName,
                        imageUrl: signedUrl.toString(), // Convert SignedDownloadUrl to string
                        expiresIn: 3600
                    }));
                } catch (uploadError) {
                    log.error("Upload error", uploadError);
                    res.writeHead(500, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({error: "Failed to update profile picture"}));
                }
            });

            bb.on("error", (err) => {
                log.error("File upload error", err);
                res.writeHead(500, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "File upload failed"}));
            });

            // Pipe request to busboy
            req.pipe(bb);

        } catch (err) {
            log.error("Server error", err);
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify({error: "Internal server error"}));
        }
    }
);

// Get profile picture URL endpoint with fixed typing
export const getProfilePictureUrl = api(
    {
        expose: true,
        method: "GET",
        path: "/user/profile-picture-url",
        auth: true,
    },
    async (): Promise<{ imageUrl: string | null, expiresIn: number | null }> => {
        // Get authenticated user ID
        const auth = getAuthData();
        if (!auth) {
            throw APIError.unauthenticated("Not authenticated");
        }

        // Get user to find the image filename
        const user = await getUserById(auth.userID);

        if (!user.image) {
            return {imageUrl: null, expiresIn: null};
        }

        // Generate a signed URL that expires in 1 hour (3600 seconds)
        const ttl = 3600;
        const signedUrl = await profilePictures.signedDownloadUrl(user.image, {
            ttl: ttl
        });

        // Convert the SignedDownloadUrl to string
        return {
            imageUrl: signedUrl.url,
            expiresIn: ttl
        };
    }
);