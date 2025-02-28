import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <SignIn />
    </div>
  )
}
