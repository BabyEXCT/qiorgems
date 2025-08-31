import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-charcoal-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-charcoal-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-charcoal-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block bg-gold-600 text-white px-6 py-3 rounded-lg hover:bg-gold-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}