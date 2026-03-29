import Link from "next/link";

export const metadata = {
  title: "Access Denied — MD Brothers",
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[80px]">
      <div className="max-w-md w-full mx-4 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          You do not have permission to access this page. Only authorized
          administrators can view this content.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B88E2F] text-white rounded-xl font-medium hover:bg-[#9A7628] transition-colors shadow-md shadow-[#B88E2F]/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Homepage
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Browse Shop
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Error 403 — Forbidden
        </p>
      </div>
    </div>
  );
}
