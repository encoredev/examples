"use client";

import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Camera, Loader2} from "lucide-react";

/**
 * ProfileImage - Stateless component for displaying user profile images
 */
export function ProfileImage({
                                 name,
                                 imageUrl,
                                 size = "md",
                                 className = "",
                                 onProfileClick,
                                 showUploadIndicator = false,
                                 isUploading = false,
                                 isLoading = false
                             }: {
    name: string;
    imageUrl: string | null;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onProfileClick?: () => void;
    showUploadIndicator?: boolean;
    isUploading?: boolean;
    isLoading?: boolean;
}) {
    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("");
    };

    // Determine avatar size
    const sizeClass = {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-24 w-24"
    }[size];

    return (
        <div
            className={`relative ${onProfileClick ? 'cursor-pointer' : ''}`}
            onClick={onProfileClick}
        >
            <Avatar className={`${sizeClass} ${className} ${isUploading ? 'opacity-70' : ''}`}>
                {imageUrl && !isLoading ? (
                    <AvatarImage
                        src={imageUrl}
                        alt={name}
                    />
                ) : null}
                <AvatarFallback className={size === "lg" ? "text-xl" : ""}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                        getInitials(name)
                    )}
                </AvatarFallback>
            </Avatar>

            {/* Camera icon indicator for profile picture upload functionality */}
            {showUploadIndicator && (
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                        <Camera className="h-4 w-4"/>
                    )}
                </div>
            )}
        </div>
    );
}