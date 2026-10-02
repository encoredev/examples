"use client";

import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import encoreAPI from "../lib/encore_api";
import {authClient} from "../lib/auth_client";

// Define the types for our API responses
type ProfileImageResponse = {
    imageUrl: string | null;
    expiresIn: number | null;
};

// Define the context type
interface ProfileImageContextType {
    imageUrl: string | null;
    isLoading: boolean;
    error: Error | null;
    refreshProfileImage: () => Promise<void>;
    uploadProfileImage: (file: File) => Promise<{ success: boolean; message: string }>;
    isAuthenticated: boolean;
}

// Create the context with default values
const ProfileImageContext = createContext<ProfileImageContextType>({
    imageUrl: null,
    isLoading: false,
    error: null,
    refreshProfileImage: async () => {
    },
    uploadProfileImage: async () => ({success: false, message: "Context not initialized"}),
    isAuthenticated: false
});

/**
 * Provider component for profile image state
 */
export const ProfileImageProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {data: session} = authClient.useSession();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // Use a ref to track if we've already attempted to load the image
    const hasAttemptedFetch = useRef(false);

    // Function to fetch profile image URL
    const fetchProfileImageUrl = useCallback(async (force = false) => {
        // Don't attempt to fetch if there's no session
        if (!session) return;

        // Don't fetch if we've already loaded the image or attempted to load it,
        // unless we're forcing a refresh
        if (hasAttemptedFetch.current && !force) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await encoreAPI.User.getProfilePictureUrl() as ProfileImageResponse;

            if (result && result.imageUrl) {
                setImageUrl(result.imageUrl);
            } else {
                setImageUrl(null);
            }

            // Mark that we've attempted to fetch
            hasAttemptedFetch.current = true;
        } catch (err) {
            console.error("Error loading profile image URL:", err);
            setImageUrl(null);
            setError(err instanceof Error ? err : new Error("Failed to load profile image"));
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    // Upload a profile image and get the new URL
    const uploadProfileImage = useCallback(async (file: File): Promise<{ success: boolean; message: string }> => {
        // Don't attempt to upload if there's no session
        if (!session) {
            return {success: false, message: "You must be logged in to upload a profile image."};
        }

        setIsLoading(true);
        setError(null);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append("profilePicture", file);

            // Upload profile picture
            await encoreAPI.User.uploadProfilePicture('POST', formData);

            // Force refresh the profile image URL after upload
            await fetchProfileImageUrl(true);

            return {success: true, message: "Profile picture updated successfully!"};
        } catch (err) {
            console.error("Error uploading profile picture:", err);
            setError(err instanceof Error ? err : new Error("Failed to upload profile image"));
            return {success: false, message: "Failed to upload profile picture. Please try again."};
        } finally {
            setIsLoading(false);
        }
    }, [session, fetchProfileImageUrl]);

    // Fetch image URL when the session changes (user logs in or out)
    useEffect(() => {
        if (session) {
            // Only need to reset the flag when session changes
            if (!hasAttemptedFetch.current) {
                fetchProfileImageUrl();
            }
        } else {
            // Clear the image URL when the user logs out
            setImageUrl(null);
            setIsLoading(false);
            setError(null);
            hasAttemptedFetch.current = false;
        }
    }, [session, fetchProfileImageUrl]);

    // Function to manually refresh the profile image
    const refreshProfileImage = useCallback(() => {
        return fetchProfileImageUrl(true);
    }, [fetchProfileImageUrl]);

    const contextValue: ProfileImageContextType = {
        imageUrl,
        isLoading,
        error,
        refreshProfileImage,
        uploadProfileImage,
        isAuthenticated: !!session
    };

    return (
        <ProfileImageContext.Provider value={contextValue}>
            {children}
        </ProfileImageContext.Provider>
    );
};

/**
 * Hook to use the profile image context
 */
export const useProfileImage = () => useContext(ProfileImageContext);