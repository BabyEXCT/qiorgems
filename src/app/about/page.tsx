'use client'

import { Award, Users, Gem, Heart, Shield, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{background: 'linear-gradient(to bottom right, var(--color-cream-50), var(--color-gold-100), var(--color-cream-100))'}}>
        <div className="absolute inset-0 bg-[url('/image-2.png')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" style={{backgroundColor: 'var(--color-gold-100)', color: 'var(--color-gold-800)'}}>
              <Heart className="h-4 w-4 mr-2" />
              Our Heritage
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{fontFamily: 'var(--font-family-playfair)', color: 'var(--color-charcoal-900)'}}>
              Our Story
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--color-charcoal-600)'}}>
              For over three decades, QioGems has been crafting exceptional jewelry pieces that celebrate life's most precious moments. 
              Our passion for perfection and commitment to quality has made us a trusted name in fine jewelry.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Crafting Excellence Since 1990
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                QioGems was founded with a simple yet profound mission: to create jewelry that captures the essence of love, 
                celebration, and personal expression. Every piece we craft tells a story, whether it's an engagement ring that 
                marks the beginning of a lifelong journey or a necklace that becomes a cherished family heirloom.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our master craftsmen combine traditional techniques with modern innovation, ensuring that each piece meets 
                the highest standards of quality and beauty. We source only the finest materials, from conflict-free diamonds 
                to ethically sourced precious metals.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gold-100 to-cream-200 rounded-3xl overflow-hidden premium-shadow">
                <img
                  src="/image-1.png"
                  alt="QioGems Craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gold-200">
                <div className="text-center">
                  <Award className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-charcoal-900">30+</div>
                  <div className="text-sm text-charcoal-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16" style={{background: 'linear-gradient(to bottom, white, var(--color-cream-50))'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from design to delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 premium-shadow hover:shadow-xl transition-all duration-300 border border-gold-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: 'var(--color-gold-100)'}}>
                <Gem className="h-8 w-8" style={{color: 'var(--color-gold-600)'}} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Craftsmanship</h3>
              <p className="text-gray-600">
                Every piece is meticulously handcrafted by our skilled artisans, ensuring exceptional quality and attention to detail.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 premium-shadow hover:shadow-xl transition-all duration-300 border border-gold-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: 'var(--color-gold-100)'}}>
                <Shield className="h-8 w-8" style={{color: 'var(--color-gold-600)'}} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ethical Sourcing</h3>
              <p className="text-gray-600">
                We are committed to responsible sourcing practices, ensuring all our materials are ethically obtained and conflict-free.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 premium-shadow hover:shadow-xl transition-all duration-300 border border-gold-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: 'var(--color-gold-100)'}}>
                <Heart className="h-8 w-8" style={{color: 'var(--color-gold-600)'}} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Care</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We provide personalized service and lifetime support for all our jewelry pieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind every QioGems creation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gold-200 to-cream-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-4xl">👨‍💼</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
              <p className="font-medium mb-2" style={{color: 'var(--color-gold-600)'}}>Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                With over 30 years in the jewelry industry, Michael founded QioGems with a vision to create timeless pieces.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gold-200 to-cream-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-4xl">👩‍🎨</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Williams</h3>
              <p className="font-medium mb-2" style={{color: 'var(--color-gold-600)'}}>Head Designer</p>
              <p className="text-gray-600 text-sm">
                Sarah brings creativity and innovation to every design, blending classic elegance with contemporary style.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gold-200 to-cream-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-4xl">👨‍🔧</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">David Rodriguez</h3>
              <p className="font-medium mb-2" style={{color: 'var(--color-gold-600)'}}>Master Craftsman</p>
              <p className="text-gray-600 text-sm">
                David's expertise in traditional jewelry making techniques ensures every piece meets our exacting standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16" style={{background: 'linear-gradient(135deg, var(--color-gold-600), var(--color-gold-700))'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">30+</div>
              <p className="text-cream-100">Years of Excellence</p>
            </div>
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">50K+</div>
              <p className="text-cream-100">Happy Customers</p>
            </div>
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">100K+</div>
              <p className="text-cream-100">Pieces Crafted</p>
            </div>
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">99%</div>
              <p className="text-cream-100">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Certifications & Awards
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recognition of our commitment to excellence and quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--color-gold-100)'}}>
                <Award className="h-10 w-10" style={{color: 'var(--color-gold-600)'}} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GIA Certified</h3>
              <p className="text-gray-600 text-sm">Gemological Institute of America certification</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--color-gold-100)'}}>
                <Shield className="h-10 w-10" style={{color: 'var(--color-gold-600)'}} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">RJC Member</h3>
              <p className="text-gray-600 text-sm">Responsible Jewellery Council certified</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--color-gold-100)'}}>
                <Star className="h-10 w-10" style={{color: 'var(--color-gold-600)'}} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Excellence Award</h3>
              <p className="text-gray-600 text-sm">2023 Jewelry Industry Excellence Award</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--color-gold-100)'}}>
                <Users className="h-10 w-10" style={{color: 'var(--color-gold-600)'}} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Choice</h3>
              <p className="text-gray-600 text-sm">Best Customer Service Award 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Visit our showroom or browse our collection online to discover jewelry that speaks to your heart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 text-white font-semibold rounded-full transition-colors"
              style={{backgroundColor: 'var(--color-gold-600)'}} 
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--color-gold-700)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--color-gold-600)'}
            >
              Browse Collection
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 font-semibold rounded-full transition-colors"
              style={{borderColor: 'var(--color-gold-600)', color: 'var(--color-gold-600)'}}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'var(--color-gold-600)';
                (e.target as HTMLElement).style.color = 'white';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
                (e.target as HTMLElement).style.color = 'var(--color-gold-600)';
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}