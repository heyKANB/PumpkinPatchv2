import React from 'react';
import { FileText, Scale, Users, AlertTriangle, Shield, Gavel } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Scale className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">User Agreement for Pumpkin Farm 3D</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: August 2024</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-purple-600" />
            Agreement to Terms
          </h2>
          <p className="text-gray-700 mb-4">
            These Terms of Service ("Terms") govern your use of the Pumpkin Farm 3D mobile application ("App") operated by Hunter Games ("we," "us," or "our").
          </p>
          <p className="text-gray-700">
            By downloading, installing, or using our App, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access or use the App.
          </p>
        </div>

        {/* App Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">App Description</h2>
          <p className="text-gray-700 mb-4">
            Pumpkin Farm 3D is a farming simulation game where users can:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Plant and harvest virtual pumpkins</li>
            <li>Maintain farming equipment through mini-games</li>
            <li>Progress through different farm areas and locations</li>
            <li>Enjoy 3D graphics and mobile-optimized gameplay</li>
          </ul>
        </div>

        {/* User Accounts and Conduct */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-purple-600" />
            User Conduct
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Acceptable Use</h3>
              <p className="text-gray-700 mb-2">You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Reverse engineer, decompile, or disassemble the App</li>
                <li>Use the App for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the App's functionality</li>
                <li>Use automated systems or bots to interact with the App</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Age Requirements */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Age Requirements</h2>
          <p className="text-blue-800 mb-3">
            The App is designed to be appropriate for all ages. However, users under 13 should have parental guidance and supervision when using the App.
          </p>
          <p className="text-blue-700 text-sm">
            Parents and guardians are responsible for monitoring their children's use of the App and ensuring compliance with these Terms.
          </p>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-purple-600" />
            Intellectual Property Rights
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              The App and its original content, features, and functionality are and will remain the exclusive property of Hunter Games and its licensors.
            </p>
            <p className="text-gray-700">
              The App is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without our prior written consent.
            </p>
          </div>
        </div>

        {/* Privacy and Data */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Collection</h2>
          <p className="text-gray-700 mb-4">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our App.
          </p>
          <p className="text-gray-700">
            By using the App, you also agree to our <a href="/privacy" className="text-purple-600 hover:text-purple-800 underline">Privacy Policy</a>.
          </p>
        </div>

        {/* Disclaimers and Limitations */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Disclaimers and Limitations
          </h2>
          <div className="space-y-3 text-yellow-800">
            <p>
              <strong>No Warranties:</strong> The App is provided "as is" without warranties of any kind, either express or implied.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> Hunter Games shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
            <p>
              <strong>Service Availability:</strong> We do not guarantee that the App will be available at all times or free from interruptions.
            </p>
          </div>
        </div>

        {/* App Store Guidelines */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">App Store Compliance</h2>
          <p className="text-gray-700 mb-4">
            This App complies with Apple App Store Guidelines and policies, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>User safety and appropriate content standards</li>
            <li>Privacy and data protection requirements</li>
            <li>Performance and technical standards</li>
            <li>Accessibility guidelines</li>
          </ul>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Gavel className="w-6 h-6 mr-3 text-purple-600" />
            Termination
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              We may terminate or suspend your access to the App immediately, without prior notice, if you breach these Terms.
            </p>
            <p className="text-gray-700">
              You may also terminate your use of the App at any time by deleting it from your device.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
          <p className="text-gray-700">
            Your continued use of the App after any changes constitutes acceptance of the new Terms.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Governing Law</h2>
          <p className="text-gray-700 text-sm">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which Hunter Games operates, without regard to conflict of law principles.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> kathrynbrown@heykanb.com</p>
            <p><strong>Support:</strong> kathrynbrown@heykanb.com</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2024 Hunter Games. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="/support" className="text-purple-600 hover:text-purple-800">Support</a>
            <a href="/privacy" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}