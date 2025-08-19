import React from 'react';
import { Shield, Globe, Users, Database, Eye, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">How we protect and handle your information</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: August 2024</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            Hunter Games ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Pumpkin Farm 3D mobile application and related services.
          </p>
          <p className="text-gray-700">
            By using our app, you agree to the collection and use of information in accordance with this policy. This policy complies with GDPR, CCPA, COPPA, and Apple's App Store Guidelines.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Database className="w-6 h-6 mr-3 text-blue-600" />
            Information We Collect
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Device information (model, operating system version, unique device identifiers)</li>
                <li>App usage analytics (gameplay statistics, feature usage, crash reports)</li>
                <li>Performance metrics (loading times, frame rates, technical diagnostics)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Information You Provide</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Game progress and achievements (stored locally on your device)</li>
                <li>Settings and preferences</li>
                <li>Support communications when you contact us</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Eye className="w-6 h-6 mr-3 text-blue-600" />
            How We Use Your Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Service Improvement</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Enhance game performance and stability</li>
                <li>Fix bugs and technical issues</li>
                <li>Develop new features and content</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">User Support</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Respond to support requests</li>
                <li>Troubleshoot technical problems</li>
                <li>Provide customer assistance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* App Tracking Transparency */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">App Tracking Transparency (iOS)</h2>
          <p className="text-yellow-800 mb-3">
            In accordance with Apple's App Tracking Transparency framework, we will ask for your permission before tracking your activity across other companies' apps and websites.
          </p>
          <p className="text-yellow-700 text-sm">
            <strong>Why we track:</strong> To provide personalized ads and improve your gaming experience by understanding how you interact with our content and similar apps.
          </p>
        </div>

        {/* Third-Party Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-3 text-blue-600" />
            Third-Party Services
          </h2>
          <p className="text-gray-700 mb-4">
            We may use third-party services for analytics, crash reporting, and app performance monitoring. These services have their own privacy policies:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Apple App Store Analytics</li>
            <li>iOS System Analytics (when enabled by user)</li>
            <li>Capacitor Framework Analytics</li>
          </ul>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-blue-600" />
            Data Security
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Data encryption in transit and at rest</li>
              <li>Secure data transmission protocols (HTTPS)</li>
              <li>Limited access to personal information</li>
              <li>Regular security assessments and updates</li>
            </ul>
          </div>
        </div>

        {/* Children's Privacy (COPPA) */}
        <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">Children's Privacy (COPPA Compliance)</h2>
          <p className="text-green-800 mb-3">
            Our app is designed to be safe for all ages, including children under 13. We do not knowingly collect personal information from children under 13 without verifiable parental consent.
          </p>
          <p className="text-green-700 text-sm">
            If you believe we have collected information from a child under 13, please contact us immediately so we can delete such information.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-600" />
            Your Privacy Rights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">GDPR Rights (EU Users)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Data portability</li>
                <li>Object to processing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">CCPA Rights (California Users)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Know what data we collect</li>
                <li>Delete personal information</li>
                <li>Opt-out of data sales</li>
                <li>Non-discrimination for exercising rights</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> privacy@huntergames.com</p>
            <p><strong>Support:</strong> support@huntergames.com</p>
            <p><strong>Address:</strong> Hunter Games Privacy Team</p>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Policy Updates</h2>
          <p className="text-gray-700 text-sm">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app and updating the "Last Updated" date. Continued use of the app after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2024 Hunter Games. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="/support" className="text-blue-600 hover:text-blue-800">Support</a>
            <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}