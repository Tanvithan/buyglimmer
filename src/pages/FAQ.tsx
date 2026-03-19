import { motion } from 'framer-motion'

export default function FAQ() {
  const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Priority drops arrive in 2-3 days." },
    { q: "Are the drops limited edition?", a: "Yes, once a SABBPE drop is sold out, it is archived and never restocked." },
    { q: "Do you offer international shipping?", a: "We ship to over 150 countries worldwide via our global logistics partners." },
    { q: "What is your return policy?", a: "We offer a 14-day return window for items in original condition." }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1400px] mx-auto pt-32 pb-24 px-4 md:px-10 min-h-screen"
    >
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 uppercase text-center">Help Center <span className="text-[#ff004c]">/</span> FAQ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {faqs.map((faq, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white/5 rounded-[30px] border border-white/10 hover:border-[#ff004c]/30 transition-all group"
          >
            <h3 className="text-xl font-bold mb-4 group-hover:text-[#ff004c] transition-colors">{faq.q}</h3>
            <p className="text-[#94a3b8] leading-relaxed">{faq.a}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
