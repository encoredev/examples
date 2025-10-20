"use client";

import { useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LogOut, 
  User, 
  Mail, 
  Shield,
  Rocket,
  Database,
  Zap
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Redirecting...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-5" />
            <span className="font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="size-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="mb-2 text-3xl font-semibold tracking-tight">
              Welcome back, {session.user.name}
            </h1>
            <p className="text-muted-foreground">
              Manage your account and explore the features
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg border bg-muted p-3">
                    <User className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-muted-foreground">{session.user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg border bg-muted p-3">
                    <Mail className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg border bg-muted p-3">
                    <Shield className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Email Verification</p>
                    <div className="flex items-center gap-2">
                      {session.user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          Not verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <p className="mb-1 text-sm font-medium">User ID</p>
                  <code className="text-xs text-muted-foreground">
                    {session.user.id}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Stack Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Rocket className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Encore.ts</h3>
                <p className="text-sm text-muted-foreground">
                  Type-safe backend with automatic infrastructure provisioning
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Shield className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Better Auth</h3>
                <p className="text-sm text-muted-foreground">
                  Secure authentication with sessions and OAuth support
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Database className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Drizzle ORM</h3>
                <p className="text-sm text-muted-foreground">
                  Type-safe database queries with PostgreSQL
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold">Next Steps</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Add more API endpoints in the <code className="rounded bg-muted px-1.5 py-0.5">auth</code> service
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Configure OAuth providers in <code className="rounded bg-muted px-1.5 py-0.5">auth/better-auth.ts</code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Extend the database schema in <code className="rounded bg-muted px-1.5 py-0.5">auth/schema.ts</code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Customize the frontend components and add more pages
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
