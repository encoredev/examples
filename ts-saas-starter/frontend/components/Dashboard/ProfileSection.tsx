import React, {useEffect, useRef, useState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
import {Edit, Loader2, Save, X} from "lucide-react";
import {authClient} from "../../lib/auth_client";
import {ProfileImage} from "../ProfileImage";
import {useProfileImage} from "../../context/ProfileImageContext";

/**
 * ProfileSection - Component for managing user profile information and profile picture
 */
export const ProfileSection: React.FC<{
    setError: (error: string | null) => void;
    setSuccess: (success: string | null) => void;
}> = ({setError, setSuccess}) => {
    const {data: session} = authClient.useSession();
    const {imageUrl, isLoading: isImageLoading, uploadProfileImage} = useProfileImage();

    // Profile States
    const [name, setName] = useState<string>("");
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [isUpdatingName, setIsUpdatingName] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update local state when session changes
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name);
        }
    }, [session]);

    // Handle profile picture click to open file selector
    const handleProfilePictureClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clear previous messages
        setError(null);
        setSuccess(null);
        setIsUploading(true);

        try {
            // Use the uploadProfileImage function from our context
            const result = await uploadProfileImage(file);

            // Set success or error message based on the result
            if (result.success) {
                setSuccess(result.message);
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error("Error in file upload handler:", err);
            setError("Failed to upload profile picture. Please try again.");
        } finally {
            setIsUploading(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Handle name editing
    const handleNameEdit = () => {
        setIsEditingName(true);
    };

    const cancelNameEdit = () => {
        setName(session?.user?.name || "");
        setIsEditingName(false);
        setError(null);
    };

    const saveNameEdit = async () => {
        if (name.trim().length < 2) {
            setError("Name must be at least 2 characters long");
            return;
        }

        setError(null);
        setSuccess(null);
        setIsUpdatingName(true);

        try {
            // Use authClient to update the user's name
            await authClient.updateUser({name});

            // Refetch Data
            await authClient.getSession({
                query: {
                    disableCookieCache: true,
                    disableRefresh: false
                }
            });

            setSuccess("Name updated successfully!");
            setIsEditingName(false);
        } catch (err) {
            console.error("Error updating name:", err);
            setError("Failed to update name. Please try again.");
        } finally {
            setIsUpdatingName(false);
        }
    };

    if (!session) {
        return <div>Loading profile...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information and profile picture
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4">
                    <ProfileImage
                        name={session.user.name || ""}
                        imageUrl={imageUrl}
                        size="lg"
                        onProfileClick={handleProfilePictureClick}
                        showUploadIndicator={true}
                        isUploading={isUploading}
                        isLoading={isImageLoading}
                    />
                    <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleProfilePictureClick}
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Change Profile Picture"}
                    </Button>
                </div>

                <div className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="flex items-center gap-2">
                            {isEditingName ? (
                                <>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isUpdatingName}
                                        placeholder="Enter your full name"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={saveNameEdit}
                                        disabled={isUpdatingName}
                                        title="Save"
                                    >
                                        {isUpdatingName ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                            <Save className="h-4 w-4"/>}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={cancelNameEdit}
                                        disabled={isUpdatingName}
                                        title="Cancel"
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Input id="name" value={session.user.name || ""} disabled/>
                                    <Button variant="ghost" size="icon" onClick={handleNameEdit}
                                            title="Edit name">
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={session.user.email || ""} disabled/>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`h-2 w-2 rounded-full ${session.user.emailVerified ? "bg-green-500" : "bg-amber-500"}`}></div>
                        <span className="text-sm font-medium">
              {session.user.emailVerified ? "Email verified" : "Email not verified"}
            </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};