'use client'

import { motion } from 'framer-motion'
import { Download, CheckCircle, Monitor, HardDrive, Cpu } from 'lucide-react'

export default function DownloadSection() {
  return (
    <section id="download" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-md mb-4">
            Download TopWindow
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Get started with TopWindow today. Free download with no subscription required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Download Options */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Primary Download */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">TopWindow for macOS</h3>
                  <p className="text-gray-600">Universal Binary • Latest Version</p>
                </div>
              </div>
              
              <button className="btn-primary w-full text-lg mb-4">
                <Download className="w-5 h-5" />
                Download for macOS
              </button>
              
              <div className="text-center text-sm text-gray-500">
                Version 2.1.0 • 15.2 MB • Free Download
              </div>
            </div>

            {/* Alternative Downloads */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Other Download Options</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="#download-placeholder" 
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Direct Download</div>
                    <div className="text-xs text-gray-500">DMG File</div>
                  </div>
                </a>
                
                <a 
                  href="#download-placeholder" 
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Beta Version</div>
                    <div className="text-xs text-gray-500">Latest Features</div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          {/* System Requirements & Installation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* System Requirements */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                System Requirements
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">macOS 13.0 (Ventura) or later</span>
                </div>
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Intel or Apple Silicon Mac</span>
                </div>
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span className="text-gray-700">50 MB available storage</span>
                </div>
              </div>
            </div>

            {/* Quick Installation Guide */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-6">Quick Installation</h4>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <span className="text-gray-700">Download and open the DMG file</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <span className="text-gray-700">Drag TopWindow to Applications folder</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <span className="text-gray-700">Launch and grant accessibility permissions</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Need help?</strong> Check our{' '}
                  <a href="/docs" className="text-primary hover:underline">documentation</a>{' '}
                  or{' '}
                  <a href="/faq" className="text-primary hover:underline">FAQ</a>{' '}
                  for installation guides.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}