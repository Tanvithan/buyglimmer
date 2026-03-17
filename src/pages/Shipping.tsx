import { motion } from 'framer-motion'
import { Truck, Globe, ShieldCheck } from 'lucide-react'

export default function Shipping() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1400px] mx-auto pt-32 pb-24 px-4 md:px-10 min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 uppercase text-center">Logistics <span className="text-[#ff004c]">&</span> Shipping</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
            <Truck className="mx-auto mb-4 text-[#ff004c]" size={40} />
            <h3 className="font-bold mb-2">Fast Delivery</h3>
            <p className="text-sm text-[#94a3b8]">Priority handling for all premium drops.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
            <Globe className="mx-auto mb-4 text-[#ff004c]" size={40} />
            <h3 className="font-bold mb-2">Global Reach</h3>
            <p className="text-sm text-[#94a3b8]">Worldwide shipping to over 150 nations.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
            <ShieldCheck className="mx-auto mb-4 text-[#ff004c]" size={40} />
            <h3 className="font-bold mb-2">Secure Transit</h3>
            <p className="text-sm text-[#94a3b8]">Fully insured and tracked shipments.</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-[#94a3b8]">
          <h2 className="text-white">Shipping Protocol</h2>
          <p>Orders are processed within 24-48 hours. Once dispatched, a transmission ID (Tracking Number) will be sent to your registered email.</p>
          <h2 className="text-white mt-8">International Duties</h2>
          <p>Local taxes and import duties may be applied by your regional authorities. These are the responsibility of the recipient.</p>
        </div>
      </div>
    </motion.div>
  )
}
