import { RotateCcw, Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600">
            Your satisfaction is our priority. Learn about our hassle-free return policy.
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <RotateCcw className="h-6 w-6 text-rose-600 mr-3" />
            Return Policy Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Returns</h3>
              <p className="text-gray-600">
                Return any item within 30 days of delivery for a full refund or exchange.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Returns</h3>
              <p className="text-gray-600">
                We provide prepaid return labels for all domestic returns at no cost to you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">
                All items must be in original condition with tags and packaging intact.
              </p>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Return an Item</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg font-bold text-rose-600">1</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Initiate Your Return</h3>
                <p className="text-gray-600 mb-3">
                  Contact our customer service team or use our online return portal to start your return. 
                  You'll need your order number and the reason for return.
                </p>
                <div className="bg-rose-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Online:</strong> Visit our return portal with your order number<br/>
                    <strong>Email:</strong> returns@qiogems.com<br/>
                    <strong>Phone:</strong> 1-800-QIO-GEMS
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg font-bold text-rose-600">2</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Receive Return Label</h3>
                <p className="text-gray-600">
                  We'll email you a prepaid return shipping label within 24 hours. Print the label 
                  and attach it to the original packaging.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg font-bold text-rose-600">3</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Your Item</h3>
                <p className="text-gray-600">
                  Place the jewelry in its original box with all included materials (certificate, 
                  cleaning cloth, etc.). Use the original shipping box if available.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg font-bold text-rose-600">4</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ship Your Return</h3>
                <p className="text-gray-600">
                  Drop off your package at any authorized shipping location or schedule a pickup. 
                  You'll receive tracking information once the package is scanned.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-lg font-bold text-rose-600">5</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Receive Your Refund</h3>
                <p className="text-gray-600">
                  Once we receive and inspect your return, we'll process your refund within 3-5 business days. 
                  Refunds are issued to the original payment method.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Return Conditions */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Conditions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Eligible for Return
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Items in original, unworn condition
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Original packaging and tags intact
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Certificate of authenticity included
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Returned within 30 days of delivery
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  No signs of wear, damage, or alteration
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  All original accessories included
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                Not Eligible for Return
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  Custom or personalized jewelry
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  Items showing signs of wear
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  Damaged or altered items
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  Items without original packaging
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  Returns after 30-day period
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  Pierced earrings (hygiene reasons)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exchanges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Exchanges</h3>
              <p className="text-gray-600 mb-4">
                Need a different ring size? We offer free size exchanges within 30 days. 
                The exchange process is the same as returns, but specify that you want an exchange.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Ring Sizing Guide</h4>
                <p className="text-sm text-gray-600">
                  Not sure about your ring size? Download our printable ring sizer or 
                  visit a local jeweler for professional sizing.
                </p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Download Ring Sizer →
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Exchanges</h3>
              <p className="text-gray-600 mb-4">
                Want to exchange for a different style? We're happy to help! The item must be 
                in original condition, and you'll pay or receive the price difference.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Exchange Process</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Contact us with your preferred new item</li>
                  <li>• We'll calculate any price difference</li>
                  <li>• Return your original item</li>
                  <li>• We'll ship your new item once received</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* International Returns */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">International Returns</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Process</h3>
              <p className="text-gray-600 mb-4">
                International customers can return items within 30 days. However, return 
                shipping costs are the responsibility of the customer.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Contact us to initiate the return
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Use a trackable shipping method
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Declare the item as "returned merchandise"
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Include original customs documentation
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Customs & Duties</h4>
                      <p className="text-sm text-gray-600">
                        You may be responsible for return customs duties. We recommend 
                        checking with your local customs office.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Refund Processing</h4>
                  <p className="text-sm text-gray-600">
                    International refunds may take 7-10 business days to process due to 
                    currency conversion and international banking procedures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty & Repairs */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Warranty & Repairs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifetime Warranty</h3>
              <p className="text-gray-600 mb-4">
                All QioGems jewelry comes with a lifetime warranty against manufacturing defects. 
                This covers issues with craftsmanship, not normal wear and tear.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Covered Under Warranty</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Loose or missing stones</li>
                  <li>• Broken clasps or findings</li>
                  <li>• Tarnishing of precious metals</li>
                  <li>• Manufacturing defects</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Repair Services</h3>
              <p className="text-gray-600 mb-4">
                Need a repair that's not covered under warranty? We offer professional 
                repair services for all types of jewelry, even if not purchased from us.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Repair Services</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ring resizing</li>
                  <li>• Stone replacement</li>
                  <li>• Chain repair</li>
                  <li>• Clasp replacement</li>
                  <li>• Polishing and refinishing</li>
                </ul>
                <button className="mt-3 text-rose-600 hover:text-rose-700 text-sm font-medium">
                  Get Repair Quote →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Returns FAQ</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does it take to process a refund?
              </h3>
              <p className="text-gray-600">
                Once we receive and inspect your return, refunds are processed within 3-5 business days. 
                It may take an additional 3-7 business days for the refund to appear on your statement.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I return a gift?
              </h3>
              <p className="text-gray-600">
                Yes, gifts can be returned within 30 days of the original delivery date. The refund 
                will be issued to the original purchaser's payment method, or we can provide store credit.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I lost my receipt or order confirmation?
              </h3>
              <p className="text-gray-600">
                No problem! We can look up your order using your email address or phone number. 
                Our customer service team will help you locate your purchase information.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I return sale items?
              </h3>
              <p className="text-gray-600">
                Yes, sale items can be returned following the same 30-day policy. However, 
                final sale items (clearly marked as such) cannot be returned or exchanged.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help with a Return?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to make your return process as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:returns@qiogems.com"
              className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Start Return Process
            </a>
            <a
              href="tel:1-800-QIO-GEMS"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Call 1-800-QIO-GEMS
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}