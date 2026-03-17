import { motion } from 'framer-motion'

export default function Privacy() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1400px] mx-auto pt-32 pb-24 px-4 md:px-10 min-h-screen"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 uppercase">Privacy <span className="text-[#ff004c]">Policy</span></h1>
        <div className="space-y-8 text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Data Encryption</h2>
            <p>Your procurement data is encrypted via secure-layer protocols. We do not store sensitive payment credentials on our primary nodes.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Metadata Usage</h2>
            <p>We collect essential metadata to optimize your browsing experience and ensure the integrity of limited-access drops.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Secure Channels</h2>
            <p>Communication regarding order status is transmitted via verified tunnels to protect your identity.</p>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
