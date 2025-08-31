import { Truck, Clock, Shield, Globe, Package, MapPin } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600">
            We're committed to delivering your precious jewelry safely and securely
          </p>
        </div>

        {/* Shipping Options */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Truck className="h-6 w-6 text-rose-600 mr-3" />
            Shipping Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Shipping */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Shipping</h3>
                <p className="text-2xl font-bold text-rose-600 mb-2">FREE</p>
                <p className="text-sm text-gray-600 mb-4">5-7 business days</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Free on orders over $100</li>
                  <li>• Tracking included</li>
                  <li>• Signature required</li>
                  <li>• Insurance included</li>
                </ul>
              </div>
            </div>

            {/* Express Shipping */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Shipping</h3>
                <p className="text-2xl font-bold text-rose-600 mb-2">$15.00</p>
                <p className="text-sm text-gray-600 mb-4">2-3 business days</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Expedited processing</li>
                  <li>• Priority handling</li>
                  <li>• Tracking included</li>
                  <li>• Signature required</li>
                </ul>
              </div>
            </div>

            {/* Overnight Shipping */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Overnight Shipping</h3>
                <p className="text-2xl font-bold text-rose-600 mb-2">$35.00</p>
                <p className="text-sm text-gray-600 mb-4">1 business day</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Next business day delivery</li>
                  <li>• Premium packaging</li>
                  <li>• Real-time tracking</li>
                  <li>• Adult signature required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Globe className="h-6 w-6 text-rose-600 mr-3" />
            International Shipping
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Countries</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Canada</span>
                  <span className="text-gray-600">$25 • 7-10 days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">United Kingdom</span>
                  <span className="text-gray-600">$35 • 10-14 days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">European Union</span>
                  <span className="text-gray-600">$40 • 10-14 days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Australia</span>
                  <span className="text-gray-600">$45 • 12-16 days</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Other Countries</span>
                  <span className="text-gray-600">Contact us</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Customs duties and taxes are the responsibility of the recipient
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  All international shipments require adult signature
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Delivery times may vary due to customs processing
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Full insurance coverage included on all shipments
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  Tracking available for all international orders
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Processing & Packaging */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="h-6 w-6 text-rose-600 mr-3" />
            Processing & Packaging
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Processing</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-rose-600">1</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Order Verification</h4>
                    <p className="text-sm text-gray-600">We verify payment and shipping details within 2 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-rose-600">2</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Quality Inspection</h4>
                    <p className="text-sm text-gray-600">Each piece is carefully inspected by our experts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-rose-600">3</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Secure Packaging</h4>
                    <p className="text-sm text-gray-600">Items are packaged in our signature gift boxes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-rose-600">4</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Shipment</h4>
                    <p className="text-sm text-gray-600">Your order ships within 1-2 business days</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging Details</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Luxury Gift Box</h4>
                  <p className="text-sm text-gray-600">
                    Every QioGems piece comes in our signature black gift box with rose gold accents, 
                    perfect for gifting or personal storage.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Security Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tamper-evident sealing</li>
                    <li>• Discreet outer packaging</li>
                    <li>• Shock-resistant padding</li>
                    <li>• Moisture protection</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Included Items</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Certificate of authenticity</li>
                    <li>• Care instructions</li>
                    <li>• Warranty information</li>
                    <li>• Jewelry cleaning cloth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking & Delivery */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <MapPin className="h-6 w-6 text-rose-600 mr-3" />
            Tracking & Delivery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Tracking</h3>
              <p className="text-gray-600 mb-4">
                Once your order ships, you'll receive a tracking number via email. You can track your 
                package's progress in real-time through our website or the carrier's tracking system.
              </p>
              <div className="bg-rose-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Track Your Order</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Enter your order number or tracking number to get real-time updates.
                </p>
                <button className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors">
                  Track Package
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Signature Required</h4>
                  <p className="text-sm text-gray-600">
                    All jewelry shipments require an adult signature for security. Someone 18+ must be 
                    present to receive the package.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Delivery Attempts</h4>
                  <p className="text-sm text-gray-600">
                    If no one is available to sign, the carrier will make up to 3 delivery attempts 
                    before returning the package to the local facility.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Safe Delivery</h4>
                  <p className="text-sm text-gray-600">
                    For your security, packages cannot be left unattended. We recommend shipping to 
                    an address where someone will be available during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping FAQ</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I need my order by a specific date?
              </h3>
              <p className="text-gray-600">
                For time-sensitive orders, please contact our customer service team at least 48 hours 
                before your needed delivery date. We'll work with you to ensure your jewelry arrives on time.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my shipping address after placing an order?
              </h3>
              <p className="text-gray-600">
                Address changes are possible within 2 hours of placing your order. After that, we cannot 
                guarantee changes as your order may have already entered our fulfillment process.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you ship to P.O. boxes?
              </h3>
              <p className="text-gray-600">
                For security reasons, we cannot ship to P.O. boxes. All shipments require a physical 
                address where an adult can sign for the package.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if my package is lost or damaged?
              </h3>
              <p className="text-gray-600">
                All shipments are fully insured. If your package is lost or damaged during transit, 
                we'll work with the carrier to resolve the issue and ensure you receive your jewelry.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to assist with any shipping questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:shipping@qiogems.com"
              className="bg-charcoal-600 text-white px-6 py-3 rounded-lg hover:bg-charcoal-700 transition-colors"
            >
              Email Support
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
    </div>
  )
}