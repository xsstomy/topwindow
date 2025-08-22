'use client'

import { motion } from 'framer-motion'
import { Play, MousePointer2, Command, Check } from 'lucide-react'
import { useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'Select the window you want to pin',
    description: 'Click on any application window to make it active.',
    icon: MousePointer2
  },
  {
    number: '02',
    title: 'Press ⌥⌘P or click "Pin Current Window" in menu bar',
    description: 'Use the keyboard shortcut or access the menu bar for one-click pinning.',
    icon: Command
  },
  {
    number: '03',
    title: 'Done — your window stays on top',
    description: 'The window will remain visible above all other applications.',
    icon: Check
  }
]

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="section-padding bg-gradient-to-br from-gray-light to-blue-50">
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
            See It in Action
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            TopWindow makes window management effortless. Watch how simple it is
            to keep any window always on top.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Demo Video/Animation Area */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Simulated Video Player */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center relative">
                
                {/* Background Window Simulation */}
                <div className="absolute inset-4">
                  <div className="w-full h-full bg-gray-800 rounded-lg opacity-50">
                    <div className="h-6 bg-gray-700 rounded-t-lg"></div>
                  </div>
                </div>
                
                {/* Foreground Window Simulation */}
                <motion.div 
                  className="absolute inset-8 bg-white rounded-lg shadow-lg z-10"
                  animate={isPlaying ? { 
                    scale: [1, 1.05, 1],
                    y: [0, -10, 0] 
                  } : {}}
                  transition={{ 
                    duration: 2,
                    repeat: isPlaying ? Infinity : 0,
                    repeatDelay: 1 
                  }}
                >
                  <div className="h-6 bg-gray-100 rounded-t-lg flex items-center px-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  
                  {/* Pin Indicator */}
                  {isPlaying && (
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full text-xs"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 }}
                    >
                      📌
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Play Button */}
                {!isPlaying && (
                  <motion.button
                    className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-dark transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </motion.button>
                )}
                
                {/* Keyboard Shortcut Hint */}
                {isPlaying && (
                  <motion.div 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    ⌥⌘P pressed
                  </motion.div>
                )}
              </div>
              
              {/* Playback Controls */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-4 h-4" fill={isPlaying ? "currentColor" : "none"} />
                  </button>
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      animate={isPlaying ? { width: ['0%', '100%'] } : { width: '0%' }}
                      transition={{ duration: 3, repeat: isPlaying ? Infinity : 0 }}
                    />
                  </div>
                  <span className="text-sm text-gray-secondary">0:15</span>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full"></div>
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-100 rounded-full"></div>
          </motion.div>
          
          {/* Right: Operation Steps */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex gap-6 items-start"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                </div>
                
                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <step.icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <h3 className="text-xl font-semibold text-gray-text leading-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {/* Bottom Hint */}
            <motion.div 
              className="mt-12 p-6 bg-white rounded-2xl border border-primary/20 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-text">That's it!</p>
                  <p className="text-sm text-gray-secondary">
                    No complex setup, no learning curve. Just instant productivity.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}