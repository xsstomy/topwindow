'use client'

import { motion } from 'framer-motion'
import { Mail, FileText } from 'lucide-react'

const supportOptions = [
  {
    icon: FileText,
    title: 'Frequently Asked Questions',
    description: 'Browse our comprehensive FAQ section to find quick solutions to common questions.',
    action: 'View FAQ',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send an email to our technical support team and we will respond promptly.',
    action: 'Send Email',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
]

export default function SupportSection() {
  return (
    <section id="support" className="section-padding bg-gray-50">
      <div className="container-custom">
        
        {/* Title Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-md mb-4">
            Technical Support
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            We're here to help you succeed. Whatever questions you have, you can reach out to us through the following methods.
          </p>
        </motion.div>
        
        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <motion.div
              key={option.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary/20">
                
                {/* Icon */}
                <motion.div 
                  className={`w-16 h-16 rounded-2xl ${option.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <option.icon className={`w-8 h-8 ${option.color}`} />
                </motion.div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-text mb-4">
                  {option.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-secondary leading-relaxed mb-6">
                  {option.description}
                </p>
                
                {/* Button */}
                <button className="w-full btn-secondary text-sm font-medium">
                  {option.action}
                </button>
                
                {/* Hover Decoration */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Contact Information */}
        <motion.div 
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-gray-text mb-4">
            Contact Information
          </h3>
          <p className="text-gray-secondary mb-8 max-w-2xl mx-auto">
            If you have additional questions or feedback, feel free to contact us using the information below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-text mb-2">Email Address</h4>
              <p className="text-gray-secondary">support@topwindow.app</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-text mb-2">Response Time</h4>
              <p className="text-gray-secondary">Within 24 hours</p>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}