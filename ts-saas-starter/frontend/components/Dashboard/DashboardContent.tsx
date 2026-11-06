"use client";

import React, {useState} from "react";
import {TabsContent} from "../ui/tabs";
import {authClient} from "../../lib/auth_client";
import {Notifications} from "./Notifications";
import {ProfileSection} from "./ProfileSection";
import {SecuritySection} from "./SecuritySection";
import {BillingSection} from "./BillingSection";

/**
 * DashboardContent - Main dashboard component that manages the user's profile, security, and billing sections
 * Renders different tab content based on the selected tab value from parent component
 */
export default function DashboardContent() {
    // Let Better Auth manage the session state for us
    const {isPending} = authClient.useSession();

    // Notification States
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Show loading state while checking session
    if (isPending) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
        </div>
    }

    return (
        <>
            {/* Notification area for errors and success messages */}
            <Notifications error={error} success={success}/>

            {/* Profile Tab */}
            <TabsContent value="profile">
                <ProfileSection
                    setError={setError}
                    setSuccess={setSuccess}
                />
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
                <SecuritySection
                    setError={setError}
                    setSuccess={setSuccess}
                />
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
                <BillingSection
                    setError={setError}
                    setSuccess={setSuccess}
                />
            </TabsContent>
        </>
    );
}