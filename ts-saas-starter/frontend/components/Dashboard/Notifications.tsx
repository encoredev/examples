import React from "react";
import {Alert, AlertDescription} from "../ui/alert";

/**
 * Notifications - Component for displaying error and success messages
 *
 * @param {Object} props - Component props
 * @param {string|null} props.error - Error message to display
 * @param {string|null} props.success - Success message to display
 */
export const Notifications: React.FC<{
    error: string | null;
    success: string | null;
}> = ({error, success}) => {
    return (
        <>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="bg-green-50 border-green-200 mb-4">
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
            )}
        </>
    );
};