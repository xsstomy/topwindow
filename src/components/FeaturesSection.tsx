'use client'

import { motion } from 'framer-motion'
import { Keyboard, Menu, Monitor, Zap } from 'lucide-react'

const features = [
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    description: 'Instantly pin/unpin windows with ⌥⌘P.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Menu,
    title: 'One-click Menu Bar Control',
    description: 'Manage pinned windows with a simple menu.',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Monitor,
    title: 'Multi-Window Support',
    description: 'Keep multiple windows on top at the same time.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Zap,
    title: 'Lightweight & Fast',
    description: 'Minimal CPU usage, works seamlessly in the background.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        
        {/* Title area */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-md mb-4">
            Why Choose TopWindow?
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Designed with simplicity and efficiency in mind, TopWindow provides
            the perfect balance of power and ease of use.
          </p>
        </motion.div>
        
        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
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
                  className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </motion.div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-text mb-4">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-secondary leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover decoration */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  )
}