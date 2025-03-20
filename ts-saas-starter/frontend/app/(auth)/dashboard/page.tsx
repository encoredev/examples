"use client";

import {authClient} from "../../../lib/auth_client";
import {Tabs, TabsList, TabsTrigger} from "../../../components/ui/tabs";
import {CreditCard, Shield, User} from "lucide-react";
import DashboardContent from "../../../components/Dashboard/DashboardContent";
import {Alert, AlertDescription} from "../../../components/ui/alert";
import {useEffect, useState} from "react";

export default function DashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const {data: session, isPending, error} = authClient.useSession();

    // Only show loading on client after first render
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Render a consistent initial UI for server and client
    // Then only show loading spinner after hydration is complete
    if (!isClient) {
        return (
            <div className="container mx-auto px-4 py-8">
                {/* Empty container that matches the structure of the full dashboard */}
                <div className="min-h-screen"></div>
            </div>
        );
    }

    // Only show loading state after client-side hydration
    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
            </div>
        );
    }

    // Display error if session fetch failed
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertDescription>
                        Error loading user session. Please try refreshing the page.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Don't render anything if not authenticated (will redirect)
    if (!session) {
        return null;
    }

    // User is authenticated, render the dashboard
    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account, and billing in one place
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4"/>
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4"/>
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4"/>
                        Billing
                    </TabsTrigger>
                </TabsList>

                {/* Render the dashboard content */}
                <DashboardContent/>
            </Tabs>
        </div>
    );
}