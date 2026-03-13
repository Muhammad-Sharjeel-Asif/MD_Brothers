import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white w-full border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Logo Section - Left Side */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image
                src="/images/logo.png"
                alt="MD Brothers Edu"
                width={200}
                height={50}
                className="w-40 sm:w-48 h-auto"
                priority={false}
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-xs">
             Comprehensive resources for schools and institutions everywhere.
            </p>
          </div>

          {/* Links Section - Right Side */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Quick Links */}
            <div className="flex flex-col">
              <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <div className="flex flex-col space-y-3">
                {['Home', 'Shop', 'About', 'Blog', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 w-fit"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="flex flex-col">
              <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">
                Support
              </h3>
              <div className="flex flex-col space-y-3">
                {[
                  { name: 'Support Center', path: '/support' },
                  { name: 'Payment Options', path: '/payment-options' },
                  { name: 'Returns', path: '/returns' },
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 w-fit"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col">
              <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Stay connected for updates and educational insights.
              </p>
              <div className="flex items-center gap-3">
                {[
                  {
                    href: "https://facebook.com",
                    label: "Facebook",
                    color: "#1877F2",
                    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  },
                  {
                    href: "https://twitter.com",
                    label: "Twitter",
                    color: "#000000",
                    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  },
                  {
                    href: "https://instagram.com",
                    label: "Instagram",
                    gradient: true,
                    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  },
                  {
                    href: "https://linkedin.com",
                    label: "LinkedIn",
                    color: "#0A66C2",
                    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  },
                  {
                    href: "https://tiktok.com",
                    label: "TikTok",
                    color: "#000000",
                    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                  }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <svg 
                      className="w-5 h-5 sm:w-5 sm:h-5" 
                      viewBox="0 0 24 24" 
                      aria-hidden="true"
                    >
                      {social.gradient ? (
                        <>
                          <defs>
                            <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#833AB4"/>
                              <stop offset="50%" stopColor="#FD1D1D"/>
                              <stop offset="100%" stopColor="#F77737"/>
                            </linearGradient>
                          </defs>
                          <path fill="url(#instagram-gradient)" d={social.path}/>
                        </>
                      ) : (
                        <path fill={social.color} d={social.path}/>
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs sm:text-sm text-gray-600">
              © {currentYear} MD Brothers Edu. All rights reserved.
            </span>
            <div className="flex items-center space-x-6">
              <Link href="/terms" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;