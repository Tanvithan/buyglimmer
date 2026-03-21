import { Mail, Phone, MapPin, Send, MessageSquare, Star, CheckCircle } from 'lucide-react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { MouseEvent, useState } from 'react'

export default function Contact() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring animations for ultra-smooth 3D tilt tracking
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [17, -17])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-17, 17])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (formState !== 'idle') return
    setFormState('sending')
    setTimeout(() => {
      setFormState('sent')
      setTimeout(() => setFormState('idle'), 3000)
    }, 1500)
  }

  return (
    <section id="contact" className="max-w-[1400px] mx-auto pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-10 overflow-hidden relative">

      {/* Decorative Floating Background Elements */}
      <motion.div animate={{ y: [0, -30, 0], rotate: [0, 45, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-40 left-[10%] text-[#ff004c]/20 z-0 hidden lg:block">
        <Star size={50} />
      </motion.div>
      <motion.div animate={{ y: [0, 40, 0], x: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-20 right-[5%] w-64 h-64 bg-[#ff004c]/10 rounded-full blur-[100px] z-0 pointer-events-none"></motion.div>
      <motion.div animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[30%] right-[30%] w-20 h-20 bg-[#ff7b00]/10 rounded-full blur-[40px] z-0 pointer-events-none"></motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto relative z-10 w-full">

        {/* Interactive 3D Phone Pop-up */}
        <motion.div
          initial={{ opacity: 0, y: 150, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          className="relative w-full flex justify-center perspective-[2000px] py-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* We apply the 3D rotation transform here based on Mouse Hover */}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-[360px] relative cursor-crosshair"
          >
            {/* Hover floating subtle motion independent of tilt */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Dynamic Glow effect tracking the mouse roughly behind the phone */}
              <motion.div
                style={{ translateX: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]), translateY: useTransform(mouseYSpring, [-0.5, 0.5], [-30, 30]) }}
                className="absolute inset-0 bg-gradient-to-tr from-[#ff004c]/40 to-[#ff7b00]/20 blur-[60px] rounded-[50px] transform scale-110 -z-10"
              ></motion.div>

              {/* Outer Phone Casing */}
              <div className="relative bg-[#050508]/80 backdrop-blur-3xl border-[4px] border-white/10 p-6 sm:p-8 rounded-[55px] shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_2px_20px_rgba(255,255,255,0.1)] overflow-hidden">

                {/* Screen Glare Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 z-0 pointer-events-none"></div>

                {/* Phone "Dynamic Island" / Notch */}
                <div className="absolute z-30 top-4 left-1/2 transform -translate-x-1/2 w-[120px] h-7 bg-black rounded-full shadow-[inset_0_1px_5px_rgba(255,255,255,0.2)] flex items-center justify-between px-4">
                  <div className="w-2 h-2 rounded-full bg-green-500/90 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                </div>

                {/* 3D Pop-out Layer for Content */}
                <div
                  className="mt-10 relative z-20"
                  style={{ transform: "translateZ(50px)" }} // Adds depth so text pops out a bit on tilt
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, duration: 0.6, type: "spring", bounce: 0.5 }}
                    className="w-16 h-16 bg-gradient-to-br from-[#ff004c] to-[#ff7b00] rounded-2xl flex items-center justify-center mb-10 shadow-[0_15px_30px_rgba(255,0,76,0.4)] relative overflow-hidden ring-1 ring-white/20"
                  >
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}>
                      <MessageSquare size={32} className="text-white relative z-10" />
                    </motion.div>
                    <div className="absolute inset-0 bg-white/30 w-1/2 h-full skew-x-12 transform -translate-x-[150%] animate-[shimmer_3s_infinite]"></div>
                  </motion.div>

                  <h2 className="text-3xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent drop-shadow-lg">Get In Touch</h2>
                  <p className="text-[#94a3b8] text-sm mb-12 leading-relaxed drop-shadow-md">Direct access to Indumenti concierge. State your inquiry.</p>

                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.05, x: 10, backgroundColor: 'rgba(255,0,76,0.1)' }} className="flex items-center gap-4 text-sm opacity-90 cursor-pointer bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 transition-all shadow-xl">
                      <div className="bg-gradient-to-br from-[#ff004c] to-[#ff004c]/50 p-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(255,0,76,0.3)]"><Mail size={18} /></div>
                      <span className="font-bold tracking-wide">indumentitrading373@gmail.com</span>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05, x: 10, backgroundColor: 'rgba(255,0,76,0.1)' }} className="flex items-center gap-4 text-sm opacity-90 cursor-pointer bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 transition-all shadow-xl">
                      <div className="bg-gradient-to-br from-[#ff004c] to-[#ff004c]/50 p-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(255,0,76,0.3)]"><Phone size={18} /></div>
                      <span className="font-bold tracking-wide">+91 76050 06518</span>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05, x: 10, backgroundColor: 'rgba(255,0,76,0.1)' }} className="flex items-center gap-4 text-sm opacity-90 cursor-pointer bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 transition-all shadow-xl">
                      <div className="bg-gradient-to-br from-[#ff004c] to-[#ff004c]/50 p-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(255,0,76,0.3)]"><MapPin size={18} /></div>
                      <div className="flex flex-col">
                        <span className="font-bold tracking-wide">Fashion Hub</span>
                        <span className="text-[10px] uppercase text-[#94a3b8] opacity-80 mt-0.5">Benguluru, Karnataka</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Home bar indicator */}
                <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors z-20 cursor-pointer"></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Form Container with Staggered Animations */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-[#050508]/60 p-8 sm:p-12 rounded-[40px] border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-2xl"
        >
          <h3 className="text-2xl sm:text-3xl font-black mb-8 relative z-10 flex items-center gap-3">
            Send a Signal <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-[#ff004c]"></motion.div>
          </h3>

          <form className="flex flex-col gap-6 relative z-10" onSubmit={handleSend}>
            <motion.div whileFocus="focused" initial="unfocused" variants={{ focused: { scale: 1.02, y: -2 }, unfocused: { scale: 1, y: 0 } }}>
              <input required type="text" placeholder="Your Designation / Name" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#ff004c] focus:bg-[#ff004c]/5 focus:shadow-[0_0_20px_rgba(255,0,76,0.15)] transition-all font-medium placeholder-white/30" />
            </motion.div>

            <motion.div whileFocus="focused" initial="unfocused" variants={{ focused: { scale: 1.02, y: -2 }, unfocused: { scale: 1, y: 0 } }}>
              <input required type="email" placeholder="Secure Email Address" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#ff004c] focus:bg-[#ff004c]/5 focus:shadow-[0_0_20px_rgba(255,0,76,0.15)] transition-all font-medium placeholder-white/30" />
            </motion.div>

            <motion.div whileFocus="focused" initial="unfocused" variants={{ focused: { scale: 1.02, y: -2 }, unfocused: { scale: 1, y: 0 } }}>
              <textarea required placeholder="Transmission details..." rows={4} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#ff004c] focus:bg-[#ff004c]/5 focus:shadow-[0_0_20px_rgba(255,0,76,0.15)] transition-all resize-none font-medium placeholder-white/30 leading-relaxed"></textarea>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px -5px rgba(255,0,76,0.5)" }}
              whileTap={{ scale: 0.98 }}
              disabled={formState !== 'idle'}
              className={`mt-2 group w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 overflow-hidden relative border border-white/10
                ${formState === 'sent' ? 'bg-green-500 text-white border-green-400' : 'bg-[#ff004c] text-white hover:border-white/30'}
              `}
            >
              <AnimatePresence mode="wait">
                {formState === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative z-10 flex items-center gap-2">
                    <span>Transmit Signal</span>
                    <Send size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.div>
                )}
                {formState === 'sending' && (
                  <motion.div key="sending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative z-10 flex items-center gap-2">
                    <span className="animate-pulse flex items-center gap-2">Connecting to Secure Node <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div></span>
                  </motion.div>
                )}
                {formState === 'sent' && (
                  <motion.div key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="relative z-10 flex items-center gap-2">
                    <span>Transmission Successful</span>
                    <CheckCircle size={18} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button shimmer effect for idle state */}
              {formState === 'idle' && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer z-0 pointer-events-none"></div>
              )}
            </motion.button>
          </form>
        </motion.div>

      </div>
    </section>
  )
}
