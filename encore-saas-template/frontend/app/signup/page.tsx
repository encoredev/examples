"use client"

import { useState } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFirebase } from "@/app/lib/firebase/FirebaseProvider"
import { signupSchema, type SignupFormData } from "@/app/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { signUp, signInWithGoogle, user } = useFirebase()

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      window.location.href = '/dashboard';
    } catch (error: any) {
      // Handle specific error cases
      if (error.message === 'Sign-in cancelled by user') {
        // User closed the popup, no need to show error
        return;
      }
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true)
    try {
      await signUp(data.email, data.password)
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EBEBDF] flex items-center justify-center px-4">
      <Card className="w-full max-w-md my-24 md:my-0 space-y-8 p-8 bg-white border-zinc-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Create an account</h2>
          <p className="mt-2 text-zinc-600">
            Sign up to get started with EncoreKit
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      disabled={isLoading}
                      className="bg-white border-zinc-200 text-black placeholder:text-zinc-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="bg-white border-zinc-200 text-black placeholder:text-zinc-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="bg-white border-zinc-200 text-black placeholder:text-zinc-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-zinc-200 text-black hover:bg-zinc-50"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </Button>

        <p className="text-center text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-zinc-900 hover:text-zinc-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
} 