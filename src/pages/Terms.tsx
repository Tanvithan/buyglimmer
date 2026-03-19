import { motion } from 'framer-motion'

export default function Terms() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1400px] mx-auto pt-32 pb-24 px-4 md:px-10 min-h-screen"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 uppercase">Terms <span className="text-[#ff004c]">&</span> Conditions</h1>
        <div className="space-y-8 text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">1. Protocol Acceptance</h2>
            <p>By accessing the SABBPE digital interface, you agree to comply with our commercial protocols and terms of service. Our drops are governed by exclusive availability rules.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">2. Procurement Limits</h2>
            <p>Certain limited editions may be restricted to one unit per terminal/address to prevent unauthorized scaling of secondary market distribution.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">3. Digital Assets</h2>
            <p>All visual data, interface designs, and brand motifs are protected intellectual properties of SABBPE LUXURY GRP.</p>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
