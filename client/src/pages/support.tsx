import React from 'react';
import { Mail, MessageCircle, Shield, FileText, Users, HelpCircle, Phone, Globe } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pumpkin Farm 3D Support</h1>
          <p className="text-xl text-gray-600">Get help and support for your farming adventure</p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-3 text-green-600" />
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <a href="mailto:kathrynbrown@heykanb.com" className="text-blue-600 hover:text-blue-800">
                    kathrynbrown@heykanb.com
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Website</p>
                  <a href="https://HunterGames.app" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    HunterGames.app
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Support Hours</h3>
              <p className="text-green-700 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                Saturday - Sunday: 10:00 AM - 4:00 PM PST
              </p>
              <p className="text-green-600 text-sm mt-2">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 mr-3 text-green-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do I plant pumpkins?</h3>
              <p className="text-gray-600">Use WASD keys (desktop) or drag to move (mobile) to navigate your farmer around the field. Walk over empty soil patches to plant pumpkin seeds automatically.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">How long do pumpkins take to grow?</h3>
              <p className="text-gray-600">Pumpkins grow through 4 stages: seed → sprout → growing → mature. Each stage takes about 2 seconds, so a full pumpkin takes approximately 8 seconds to grow.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">My equipment is broken, how do I fix it?</h3>
              <p className="text-gray-600">Visit the equipment shed in the top-left corner of your farm. Select broken equipment and play the matching mini-game to repair it.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">The game isn't loading or running slowly</h3>
              <p className="text-gray-600">Try refreshing the page or closing other browser tabs. The game is optimized for modern browsers and works best with a stable internet connection.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do I earn coins?</h3>
              <p className="text-gray-600">The coin system is currently in development. Future updates will include ways to earn coins through harvesting pumpkins and completing farm activities.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I play on mobile devices?</h3>
              <p className="text-gray-600">Yes! The game is fully optimized for mobile devices with touch controls. Simply drag anywhere on the screen to move your farmer around.</p>
            </div>
          </div>
        </div>

        {/* Privacy & Terms */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-green-600" />
            Privacy & Legal
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <a 
                href="/privacy" 
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Privacy Policy</p>
                  <p className="text-sm text-blue-700">How we protect your data</p>
                </div>
              </a>
              <a 
                href="/terms" 
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Users className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Terms of Service</p>
                  <p className="text-sm text-purple-700">User agreement and guidelines</p>
                </div>
              </a>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Data Collection</h3>
              <p className="text-yellow-700 text-sm">
                We collect minimal data to improve your gaming experience. All data is handled according to our Privacy Policy and applicable laws including GDPR, CCPA, and COPPA.
              </p>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">App Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">3.5</span>
              </div>
              <p className="font-medium">Version</p>
              <p className="text-sm text-gray-600">Current Version</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">iOS</span>
              </div>
              <p className="font-medium">Platform</p>
              <p className="text-sm text-gray-600">iOS 14.5+</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">3D</span>
              </div>
              <p className="font-medium">Technology</p>
              <p className="text-sm text-gray-600">WebGL 3D Graphics</p>
            </div>
          </div>
        </div>

        {/* Developer Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Hunter Games</h3>
              <p className="text-gray-600">Independent game developer focused on creating engaging and accessible gaming experiences.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Bundle ID</p>
                <p className="text-sm text-gray-600">com.huntergames.pumpkinpatch</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-600">Version 3.5.0 - Build 30</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This app is designed to be safe for all ages and complies with Apple's App Store Guidelines, 
                privacy requirements, and accessibility standards.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2024 Hunter Games. All rights reserved.</p>
          <p className="text-sm mt-2">
            For technical support, feature requests, or general inquiries, please contact us using the information above.
          </p>
        </div>
      </div>
    </div>
  );
}