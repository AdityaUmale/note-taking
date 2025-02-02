
import SignInForm from '../components/auth/SignInForm'; 
import Link from 'next/link';

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <SignInForm />
        <p className="text-center">
          Dont have an account?{' '}
          <Link href="/sign-up" className="text-blue-500 hover:text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}