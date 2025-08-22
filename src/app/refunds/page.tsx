import type { Metadata } from 'next'
import { DollarSign, Clock, CheckCircle, AlertCircle, Mail, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy - TopWindow',
  description: 'TopWindow refund policy and process. Learn about refund eligibility, how to request a refund, and our satisfaction guarantee.',
}

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-lg mb-4">Refund Policy</h1>
          <p className="text-body max-w-2xl mx-auto">
            We want you to be completely satisfied with TopWindow. While TopWindow is free software, 
            this policy covers any future paid features or premium versions we may offer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Important Notice</h2>
            </div>
            <p className="text-blue-800 leading-relaxed">
              <strong>TopWindow is currently free software.</strong> This refund policy is provided for transparency 
              regarding any future paid features, premium versions, or related services we may offer. Currently, 
              all features of TopWindow are available at no cost.
            </p>
          </div>

          {/* Our Satisfaction Guarantee */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Our Satisfaction Guarantee</h2>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                We stand behind TopWindow and are committed to providing you with a high-quality, reliable window management solution for macOS. If we ever introduce paid features or premium versions, we want to ensure you're completely satisfied with your purchase.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your satisfaction is our priority. If you're not happy with any future paid features or services, we'll work with you to resolve any issues or provide a refund according to the terms outlined below.
              </p>
            </div>
          </section>

          {/* Refund Eligibility */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Refund Eligibility</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Eligible for Refund
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Technical issues preventing normal software operation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Software doesn't work as advertised or described</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Incompatibility with supported macOS versions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Request made within 30 days of purchase</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Accidental or duplicate purchases</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Generally Not Eligible
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Change of mind after 30-day period</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Issues caused by third-party software conflicts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Hardware compatibility issues with unsupported systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Requests without attempting to resolve issues first</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">Use in violation of license agreement</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">How to Request a Refund</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                If you believe you're eligible for a refund for any future paid features, please follow these steps:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-gray-600 text-sm">
                    Email us with your purchase details and the reason for your refund request
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Troubleshooting</h3>
                  <p className="text-gray-600 text-sm">
                    We'll first try to resolve any issues you're experiencing with the software
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Processing</h3>
                  <p className="text-gray-600 text-sm">
                    If we can't resolve the issue, we'll process your refund within 5-7 business days
                  </p>
                </div>
              </div>
            </div>

            {/* Required Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <h3 className="font-semibold text-gray-900 mb-4">Information Needed for Refund Requests</h3>
              <p className="text-gray-700 mb-4">When contacting us for a refund, please include:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">Purchase receipt or transaction ID</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">Email address used for purchase</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">Reason for refund request</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">macOS version and Mac model</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">Steps taken to resolve the issue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">Screenshots or error messages (if applicable)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Refund Timeline */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Refund Timeline</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-blue-600">Day 1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Request Received</h3>
                  <p className="text-gray-600 text-sm">We acknowledge your refund request within 24 hours</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-yellow-600">1-3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Review & Support</h3>
                  <p className="text-gray-600 text-sm">We review your case and attempt to resolve any issues</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-purple-600">3-5</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Decision</h3>
                  <p className="text-gray-600 text-sm">We make a decision and notify you of the outcome</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-green-600">5-7</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Processing</h3>
                  <p className="text-gray-600 text-sm">Approved refunds are processed back to original payment method</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Note:</strong> Refund processing times may vary depending on your bank or payment provider. 
                  Most refunds appear within 3-10 business days after processing.
                </p>
              </div>
            </div>
          </section>

          {/* Exceptions and Special Cases */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Special Circumstances</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-3">Extended Refund Period</h3>
                <p className="text-gray-700 leading-relaxed">
                  In cases of serious technical issues that prevent normal software operation, we may extend 
                  the refund period beyond 30 days on a case-by-case basis. Contact our support team to 
                  discuss your specific situation.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-3">Partial Refunds</h3>
                <p className="text-gray-700 leading-relaxed">
                  For premium features or subscription services we may offer in the future, partial refunds 
                  may be available based on usage and the specific circumstances of your request.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-3">Credit or Exchange Options</h3>
                <p className="text-gray-700 leading-relaxed">
                  In some cases, we may offer account credit or exchanges for other services instead of 
                  a direct refund, particularly if technical issues can be resolved with alternative solutions.
                </p>
              </div>
            </div>
          </section>

          {/* Contact for Refunds */}
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Need to Request a Refund?</h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              While TopWindow is currently free, if you ever need assistance with future paid features 
              or have questions about our refund policy, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:xsstomy@gmail.com?subject=Refund%20Request"
                className="btn-primary"
              >
                Contact Support
              </a>
              <a
                href="/faq"
                className="btn-secondary"
              >
                View FAQ
              </a>
            </div>
          </div>

          {/* Policy Updates */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-center text-gray-500 text-sm">
              This refund policy was last updated on January 15, 2025. We reserve the right to modify 
              this policy at any time. Changes will be posted on this page and will apply to future purchases only.<br />
              <br />
              For questions about this policy, please contact{' '}
              <a href="mailto:xsstomy@gmail.com" className="text-primary hover:underline">
                xsstomy@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}