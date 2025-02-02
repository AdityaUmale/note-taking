
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Note Taking App</h1>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/sign-in"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}