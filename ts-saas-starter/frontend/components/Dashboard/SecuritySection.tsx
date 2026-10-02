import React, {useState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Alert, AlertDescription, AlertTitle} from "../ui/alert";
import {AlertTriangle, Loader2} from "lucide-react";
import {authClient} from "../../lib/auth_client";
import {useRouter} from "next/navigation";

/**
 * SecuritySection - Component for managing user security settings like password reset and account deletion
 *
 * @param {Object} props - Component props
 * @param {Function} props.setError - Function to set error message
 * @param {Function} props.setSuccess - Function to set success message
 */
export const SecuritySection: React.FC<{
    setError: (error: string | null) => void;
    setSuccess: (success: string | null) => void;
}> = ({setError, setSuccess}) => {
    const router = useRouter();

    // Password Reset States
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);

    // Account Deletion States
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    // Handle password reset
    const handlePasswordReset = async () => {
        // Validate passwords
        if (!currentPassword) {
            setError("Current password is required");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setError(null);
        setSuccess(null);
        setIsResettingPassword(true);

        try {
            await authClient.changePassword({
                newPassword,
                currentPassword,
                revokeOtherSessions: true,
            });
            authClient.signOut();

            setSuccess("Password updated successfully!");
            router.push("/")
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Error updating password:", err);
            setError("Failed to update password. Please ensure your current password is correct.");
        } finally {
            setIsResettingPassword(false);
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            // Use the authClient to delete the user's account
            const {error: deleteError} = await authClient.deleteUser();

            if (deleteError) {
                setError(deleteError.message || "Error deleting account");
                setIsDeleting(false);
                return;
            }

            // On successful deletion, sign out and redirect to login
            await authClient.signOut();
            router.push("/login");
        } catch (err) {
            console.error("Error deleting account:", err);
            setError("An error occurred while attempting to delete your account. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="grid gap-6">
            {/* Password Reset Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Password Reset</CardTitle>
                    <CardDescription>
                        Change your account password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={isResettingPassword}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isResettingPassword}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isResettingPassword}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handlePasswordReset}
                        disabled={isResettingPassword}
                    >
                        {isResettingPassword ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Updating...
                            </>
                        ) : (
                            "Update Password"
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Account Deletion Section */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Once you delete your account, there is no going back. This action cannot be undone.
                        All your data, including your profile, projects, and settings will be permanently
                        removed.
                    </p>

                    {showDeleteConfirm && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>
                                Are you absolutely sure you want to delete your account? This action cannot be
                                undone.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 items-center">
                    {!showDeleteConfirm ? (
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete Account
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Deleting...
                                    </>
                                ) : (
                                    "Confirm Delete"
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setError(null);
                                }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};