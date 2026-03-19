import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const COLLECTIONS = [
  { id: 1, name: 'Streetwear Collection', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600', category: 'Clothing' },
  { id: 2, name: 'Premium Accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600', category: 'Accessories' },
  { id: 3, name: 'Fine Jewelry', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600', category: 'Jewelry' },
]

export default function Collections({ 
  activeCategory, 
  setActiveCategory, 
  filteredProducts, 
  wishlist, 
  toggleWishlist, 
  addToCart,
  isLoggedIn,
  setLoginPromptOpen
}: any) {
  const navigate = useNavigate()

  return (
    <section id="collections-list" className="max-w-[1400px] mx-auto pt-32 pb-16 md:pt-40 md:pb-32 px-4 md:px-10 min-h-screen overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 mb-10 md:mb-16">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 bg-[#ff004c]/10 text-[#ff004c] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[#ff004c]/20">
            {activeCategory === 'All' ? 'Full Archive' : 'Vault Selection'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            {activeCategory === 'All' ? 'Latest Releases' : activeCategory}
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          {['All', 'Clothing', 'Accessories', 'Jewelry'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-5 md:px-7 py-2.5 rounded-full border border-white/10 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-black shadow-xl shadow-white/10' : 'hover:bg-white/10 opacity-60 hover:opacity-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-10">
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((p: any) => (
            <motion.div 
              layout 
              key={p.id} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="group bg-white/5 p-3 sm:p-4 rounded-[30px] border border-white/10 hover:border-[#ff004c]/30 transition-all cursor-pointer relative w-full" 
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div className="aspect-square rounded-[22px] overflow-hidden mb-4 sm:mb-6 relative">
                <img 
                  src={p.images[0]} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080c]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <button 
                  onClick={(e) => { e.stopPropagation(); isLoggedIn ? toggleWishlist(p) : setLoginPromptOpen(true); }}
                  className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl transition-all z-10 ${
                    wishlist.some((item: any) => item.id === p.id) 
                    ? 'bg-[#ff004c] text-white' 
                    : 'bg-black/40 text-white hover:bg-[#ff004c]'
                  }`}
                >
                  <Heart size={16} className={wishlist.some((item: any) => item.id === p.id) ? "fill-white" : ""} />
                </button>
              </div>
              
              <div className="px-2">
                <p className="text-[#ff004c] text-[10px] font-black uppercase tracking-[0.2em] mb-2">{p.category}</p>
                <h3 className="font-bold text-lg mb-4 line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black tracking-tighter">₹{p.price}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); isLoggedIn ? addToCart(p) : setLoginPromptOpen(true); }} 
                    className="p-4 bg-white text-black rounded-2xl hover:bg-[#ff004c] hover:text-white transition-all shadow-xl group-hover:scale-110"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-2xl font-black opacity-20 uppercase tracking-widest">No products found in this category</p>
        </div>
      )}
    </section>
  )
}
