import type { Metadata } from 'next'
import { FileText, Shield, User, Globe, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'License Agreement - TopWindow',
  description: 'TopWindow software license agreement, usage terms, and conditions. Learn about your rights and restrictions when using TopWindow.',
}

export default function LicensePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-lg mb-4">Software License Agreement</h1>
          <p className="text-body max-w-2xl mx-auto">
            Please read this license agreement carefully before using TopWindow. By downloading and using TopWindow, you agree to the terms outlined below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* License Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">License Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  You May
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Use TopWindow on your personal computers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Install on multiple Macs you own or control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Use for both personal and commercial purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Share recommendations with others</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  You May Not
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Redistribute or sell the software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Reverse engineer or modify the software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Remove copyright or attribution notices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Use in ways that violate applicable laws</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Full License Terms */}
          <div className="space-y-12">
            {/* Grant of License */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Grant of License</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Subject to the terms and conditions of this License Agreement, TopWindow grants you a limited, non-exclusive, non-transferable license to use TopWindow ("the Software") for personal and commercial purposes on macOS devices that you own or control.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This license is granted free of charge and allows you to use the Software without payment of licensing fees or royalties, provided you comply with all terms of this agreement.
                </p>
              </div>
            </section>

            {/* Permitted Uses */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Permitted Uses</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-4">You are granted the right to:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Personal Use:</strong> Install and use the Software on any number of Mac computers that you personally own or control for personal productivity and workflow management.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Commercial Use:</strong> Use the Software in commercial, business, or professional environments without additional licensing fees.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Backup Copies:</strong> Create backup copies of the Software for archival purposes, provided such copies are not distributed or used on computers not covered by this license.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Restrictions */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Restrictions</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-4">You agree not to:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Redistribute:</strong> Sell, rent, lease, distribute, or otherwise transfer the Software or any portion thereof to any third party.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Reverse Engineer:</strong> Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Software.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Modify:</strong> Modify, adapt, translate, or create derivative works based upon the Software or any portion thereof.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Remove Attribution:</strong> Remove, alter, or obscure any copyright, trademark, or other proprietary notices from the Software.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Intellectual Property Rights</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  TopWindow and all related intellectual property rights are and shall remain the exclusive property of the TopWindow development team. This License Agreement does not grant you any ownership rights in the Software.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  All rights not expressly granted to you in this License Agreement are reserved by TopWindow. The Software is protected by copyright laws and international copyright treaties, as well as other intellectual property laws and treaties.
                </p>
              </div>
            </section>

            {/* Warranty Disclaimer */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Warranty Disclaimer</h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.</strong> TopWindow disclaims all warranties, whether express, implied, statutory, or otherwise, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  TopWindow does not warrant that the Software will meet your requirements, that its operation will be uninterrupted or error-free, or that defects will be corrected. Your use of the Software is at your sole risk.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>IN NO EVENT SHALL TOPWINDOW BE LIABLE FOR ANY DAMAGES</strong> whatsoever (including, without limitation, damages for loss of business profits, business interruption, loss of business information, or any other pecuniary loss) arising out of the use of or inability to use the Software, even if TopWindow has been advised of the possibility of such damages.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitation may not apply to you.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Termination</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  This License Agreement is effective until terminated. You may terminate it at any time by destroying all copies of the Software in your possession or control.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This License Agreement will terminate immediately without notice from TopWindow if you fail to comply with any provision of this License Agreement. Upon termination, you must destroy all copies of the Software in your possession or control.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Governing Law</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed">
                  This License Agreement shall be governed by and construed in accordance with the laws of the jurisdiction where TopWindow is developed and maintained, without regard to its conflict of law provisions. Any disputes arising under this agreement shall be resolved in accordance with applicable international software licensing standards.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Questions About This License?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  If you have any questions about this License Agreement or need clarification on any terms, please don't hesitate to contact us.
                </p>
                <a
                  href="mailto:xsstomy@gmail.com?subject=License%20Agreement%20Question"
                  className="btn-primary"
                >
                  Contact Us
                </a>
              </div>
            </section>

            {/* Agreement Footer */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-center text-gray-500 text-sm">
                Last updated: January 15, 2025<br />
                TopWindow License Agreement v2.1
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}