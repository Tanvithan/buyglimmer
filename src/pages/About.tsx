import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="max-w-[1400px] mx-auto pt-32 pb-16 md:pt-40 md:pb-32 px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
      <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        <h2 className="text-2xl md:text-5xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">The SABBPE Vision</h2>
        <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed mb-8 md:10">Founded in 2021, SABBPE represents the intersection of digital street culture and artisanal craftsmanship. We don't follow trends; we create the artifacts of tomorrow.</p>
        <div className="flex gap-8 md:gap-16">
          <div><span className="block text-3xl md:text-4xl font-black text-[#ff004c]">50k+</span><p className="text-xs uppercase tracking-widest font-bold opacity-40">Happy Customers</p></div>
          <div><span className="block text-3xl md:text-4xl font-black text-[#ff004c]">100+</span><p className="text-xs uppercase tracking-widest font-bold opacity-40">Unique Drops</p></div>
        </div>
      </motion.div>
      <div className="rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" 
          alt="Studio" 
          className="w-full h-auto"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800'; }}
        />
      </div>
    </section>
  )
}
