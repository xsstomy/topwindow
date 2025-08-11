'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    rating: 5,
    text: "Finally, the perfect always-on-top solution for macOS! I've been looking for something this simple and reliable for years.",
    author: "John D.",
    title: "Software Developer",
    avatar: "JD"
  },
  {
    rating: 5,
    text: "Simple, fast, and works exactly as promised. The keyboard shortcut is a game-changer for my workflow.",
    author: "Emily R.",
    title: "Designer",
    avatar: "ER"
  },
  {
    rating: 5,
    text: "A must-have productivity tool for my daily work. No more switching between windows constantly!",
    author: "Michael S.",
    title: "Project Manager",
    avatar: "MS"
  }
]

const stats = [
  { number: "10,000+", label: "Active Users" },
  { number: "4.8★", label: "Average Rating" },
  { number: "150+", label: "Reviews" },
  { number: "99.9%", label: "Uptime" }
]

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-md mb-4">
            What Users Say
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Join thousands of satisfied users who have made TopWindow an essential part
            of their daily workflow.
          </p>
        </motion.div>
        
        {/* 统计数据 */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-gray-secondary font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* 用户评价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary/20">
                
                {/* 引号图标 */}
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-primary/20" fill="currentColor" />
                </div>
                
                {/* 星级评价 */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                    />
                  ))}
                </div>
                
                {/* 评价内容 */}
                <blockquote className="text-gray-text leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </blockquote>
                
                {/* 用户信息 */}
                <div className="flex items-center gap-4">
                  {/* 头像 */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  
                  {/* 用户详情 */}
                  <div>
                    <div className="font-semibold text-gray-text">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-secondary">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
                
                {/* 悬停装饰 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* 底部 CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 bg-gradient-to-r from-primary/10 to-blue-100 rounded-2xl">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-gray-text mb-1">
                Ready to boost your productivity?
              </p>
              <p className="text-sm text-gray-secondary">
                Join the TopWindow community today
              </p>
            </div>
            <button className="btn-primary whitespace-nowrap">
              Download Now
            </button>
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}