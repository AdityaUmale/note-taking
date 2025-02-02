
import SignUpForm from '../components/auth/SignUpForm';
import Link from 'next/link';

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        <SignUpForm />
        <p className="text-center">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-500 hover:text-blue-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}