"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"

import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAppDispatch } from "@/store/hooks"
import { setCredentials } from "@/store/slices/authSlice"
import { useSignIn } from "@/modules/auth/api/useAuth"
import Link from "next/link"

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const signInMutation = useSignIn({
    onSuccess: (response) => {
      // Store user data and token in Redux
      dispatch(
        setCredentials({
          user: {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
          },
          token: response.session.token,
        }),
      )

      console.log("Login successful:", response)

      // Redirect to dashboard or home page
      router.push("/")
    },
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      signInMutation.mutate({
        email: value.email,
        password: value.password,
      })
    },
  })

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            type="button">
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24">
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
            Google
          </Button>
          <Button
            variant="outline"
            type="button">
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}>
          {/* Error Message */}
          {signInMutation.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {signInMutation.error.message}
            </div>
          )}

          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label
                  htmlFor="userEmail"
                  className="leading-5">
                  Email address
                </Label>
                <Input
                  type="email"
                  id="userEmail"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={signInMutation.isPending}
                />
              </div>
            )}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => (
              <div className="w-full space-y-2">
                <Label
                  htmlFor="password"
                  className="leading-5">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    className="pr-9"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={signInMutation.isPending}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    disabled={signInMutation.isPending}
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent">
                    {isVisible ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isVisible ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </form.Field>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-end">
            <a
              href="#"
              className="text-sm font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={signInMutation.isPending}>
            {signInMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Sign up link */}
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            prefetch
            className="font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
