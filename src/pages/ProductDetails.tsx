import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ShoppingBag, ChevronLeft, ChevronRight, Star, Shield, Truck, Package, Heart, ZoomIn, X } from 'lucide-react'
import type { Product } from '../data/products'
import { productApi } from '../services/productApi'

interface ProductDetailsProps {
  addToCart: (p: Product) => void;
  setCheckoutOpen: (open: boolean) => void;
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  isLoggedIn: boolean;
  setLoginPromptOpen: (open: boolean) => void;
}

export default function ProductDetails({ addToCart, setCheckoutOpen, wishlist, toggleWishlist, isLoggedIn, setLoginPromptOpen }: ProductDetailsProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping'>('desc')
  const [activeImage, setActiveImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const viewLabels = ['Front', 'Side', 'Back', 'Detail', 'Detail']

  useEffect(() => {
    if (!id) return;
    
    // Enforce real data, disable fallback

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await productApi.getById(id);
        if (data) {
          setProduct({
            id: data.productId || data.id,
            name: data.name,
            category: data.brand || 'Apparel',
            price: Number(data.price),
            images: (() => {
              if (!data.imageUrl && !data.images) return ['https://images.unsplash.com/photo-1557821552-17105176677c?w=800'];
              try {
                const imgStr = data.images || data.imageUrl;
                return Array.isArray(imgStr) ? imgStr : JSON.parse(imgStr);
              } catch(e) {
                return [data.imageUrl || data.images];
              }
            })(),
            description: data.description,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [{ name: 'Default', hex: '#000000' }],
            specs: { SKU: data.sku, Stock: data.stock },
            reviews: []
          });
          setSelectedSize('M');
          setSelectedColor('Default');
        } else {
          setProduct(null);
        }
      } catch (err) {
         setProduct(null);
      } finally {
         setLoading(false);
      }
    };
    
    fetchDetail();
  }, [id])

  if (loading) return <div className="pt-40 text-center font-black animate-pulse">LOADING DYNAMIC PRODUCT...</div>
  if (!product) return <div className="pt-40 text-center font-black">PRODUCT NOT FOUND</div>

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1400px] mx-auto pt-24 md:pt-32 pb-20 px-4 md:px-10"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 mb-8 transition-all">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          {/* Main Image with Zoom */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[40px] overflow-hidden border border-white/10 group relative bg-white/5"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = ((e.clientX - rect.left) / rect.width) * 100
              const y = ((e.clientY - rect.top) / rect.height) * 100
              setZoomPosition({ x, y })
            }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                src={product.images[activeImage]} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-all duration-500 ${isZoomed ? 'cursor-zoom-in' : ''}`}
                loading="lazy"
                style={isZoomed ? {
                  transform: 'scale(2)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                } : {}}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800'; }}
                onClick={() => setLightboxOpen(true)}
              />
            </AnimatePresence>
            
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage(activeImage === 0 ? product.images.length - 1 : activeImage - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ff004c] z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setActiveImage(activeImage === product.images.length - 1 ? 0 : activeImage + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ff004c] z-10"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            <div className="absolute top-6 right-6 flex gap-2">
              <button 
                onClick={() => setLightboxOpen(true)}
                className="p-4 bg-black/40 backdrop-blur-md rounded-2xl hover:bg-[#ff004c] transition-all"
              >
                <ZoomIn size={20} />
              </button>
              <button 
                onClick={() => isLoggedIn ? toggleWishlist(product) : setLoginPromptOpen(true)}
                className={`p-4 backdrop-blur-md rounded-2xl transition-all group/heart ${
                  wishlist.some(item => item.id === product.id) 
                  ? 'bg-[#ff004c] text-white' 
                  : 'bg-black/40 hover:bg-[#ff004c]'
                }`}
              >
                <Heart size={20} className={wishlist.some(item => item.id === product.id) ? "fill-white" : "group-hover/heart:fill-white"} />
              </button>
            </div>
            
            {/* View Badge */}
            <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full">
              <span className="text-xs font-black uppercase tracking-widest">{viewLabels[activeImage] || `View ${activeImage + 1}`}</span>
            </div>
          </motion.div>
          
          {/* Thumbnail Gallery with Labels */}
          <div className="grid grid-cols-3 gap-2 sm:g-4">
            {product.images.map((img, i) => (
              <motion.div 
                key={i} 
                onClick={() => setActiveImage(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white/5 relative ${
                  activeImage === i ? 'border-[#ff004c] opacity-100 shadow-[0_0_20px_-5px_rgba(255,0,76,0.3)]' : 'border-white/5 opacity-40 hover:opacity-100'
                }`}
              >
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800'; }}
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/60 rounded-full">
                  <span className="text-[8px] font-black uppercase tracking-widest">{viewLabels[i] || `${i + 1}`}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Side */}
        <div className="flex flex-col">
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-block px-3 py-1 bg-[#ff004c]/10 text-[#ff004c] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-none">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <span className="text-3xl font-black">₹{product.price}</span>
               <div className="flex items-center gap-1 text-yellow-500">
                 {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />)}
                 <span className="text-xs text-[#94a3b8] font-bold ml-2">(4.8 / {product.reviews?.length || 0} Reviews)</span>
               </div>
            </div>

            {/* Size Selection */}
            {product.sizes && (
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Select Size</h4>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] h-[50px] flex items-center justify-center rounded-xl border font-black text-xs transition-all ${
                        selectedSize === size ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && (
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Select Color</h4>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button 
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`min-w-[50px] h-[50px] flex items-center justify-center rounded-xl border font-black text-xs transition-all ${
                        selectedColor === color.name ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full mr-2 border border-white/20"
                        style={{ backgroundColor: color.hex }}
                      ></span>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => isLoggedIn ? addToCart(product) : setLoginPromptOpen(true)}
                className="flex-1 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#ff004c] hover:text-white transition-all flex items-center justify-center gap-3 overflow-hidden group border border-white/10 shadow-xl"
              >
                <ShoppingBag size={18} className="group-hover:animate-bounce" /> Add To Bag
              </button>
              <button 
                onClick={() => { if (isLoggedIn) { addToCart(product); setCheckoutOpen(true); } else { setLoginPromptOpen(true); } }}
                className="flex-1 py-5 bg-[#ff004c] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-[0_10px_30px_-5px_rgba(255,0,76,0.3)]"
              >
                Buy Instinctively
              </button>
            </div>

            {/* Tabs (Description, Reviews, etc) */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex gap-8 mb-6 border-b border-white/5 pb-4">
                {['desc', 'reviews', 'shipping'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab ? 'text-[#ff004c]' : 'opacity-40 hover:opacity-100'
                    }`}
                  >
                    {tab === 'desc' ? 'Specification' : tab === 'reviews' ? 'Archive Reviews' : 'Logistics'}
                    {activeTab === tab && <motion.div layoutId="tabLine" className="absolute -bottom-[17px] left-0 w-full h-0.5 bg-[#ff004c]" />}
                  </button>
                ))}
              </div>

              <div className="min-h-[150px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'desc' && (
                    <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <p className="text-sm text-[#94a3b8] leading-relaxed">
                        {product.description || `High-performance ${product.category.toLowerCase()} from the latest SABBPE drop. Engineered for durability and high-end aesthetics.`}
                      </p>
                      
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">Technical Specs</h5>
                        <div className="grid grid-cols-1 gap-1">
                          {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-3 border-b border-white/5 text-xs">
                              <span className="font-bold uppercase tracking-widest opacity-40">{key}</span>
                              <span className="font-black text-white">{value}</span>
                            </div>
                          )) : (
                            <>
                              <div className="flex justify-between py-3 border-b border-white/5 text-xs">
                                <span className="font-bold uppercase tracking-widest opacity-40">Composition</span>
                                <span className="font-black text-white">Premium Grade Materials</span>
                              </div>
                              <div className="flex justify-between py-3 border-b border-white/5 text-xs">
                                <span className="font-bold uppercase tracking-widest opacity-40">Authenticity</span>
                                <span className="font-black text-white">SABBPE Verified Tag</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'reviews' && (
                    <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      {product.reviews && product.reviews.length > 0 ? product.reviews.map((r, i) => (
                        <div key={i} className="border-b border-white/5 pb-6 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                             <span className="font-black text-sm">{r.user}</span>
                             <span className="text-[10px] opacity-40 uppercase tracking-widest font-bold">{r.date}</span>
                          </div>
                          <div className="flex text-yellow-500 mb-2 gap-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= r.rating ? "currentColor" : "none"} />)}
                          </div>
                          <p className="text-sm text-[#94a3b8]">{r.comment}</p>
                        </div>
                      )) : <p className="text-sm opacity-30 text-center py-10">No reviews yet for this signal.</p>}
                    </motion.div>
                  )}
                  {activeTab === 'shipping' && (
                    <motion.div key="shipping" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                      <div className="flex items-center gap-4 text-xs font-bold opacity-70"><Truck size={18} className="text-[#ff004c]" /> <span>Free Express Global Shipping</span></div>
                      <div className="flex items-center gap-4 text-xs font-bold opacity-70"><Shield size={18} className="text-[#ff004c]" /> <span>Consumer Protection Protocol Active</span></div>
                      <div className="flex items-center gap-4 text-xs font-bold opacity-70"><Package size={18} className="text-[#ff004c]" /> <span>Dispatched from London/Mumbai Hubs</span></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Fullscreen View */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button 
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-[#ff004c] transition-all"
            >
              <X size={24} />
            </button>
            
            {/* Navigation */}
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage === 0 ? product.images.length - 1 : activeImage - 1) }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 rounded-full hover:bg-[#ff004c] transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage === product.images.length - 1 ? 0 : activeImage + 1) }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 rounded-full hover:bg-[#ff004c] transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
            
            <motion.div 
              key={activeImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800'; }}
              />
              <div className="text-center mt-4">
                <span className="text-sm font-black uppercase tracking-widest opacity-60">{viewLabels[activeImage] || `View ${activeImage + 1}`}</span>
                <span className="text-sm opacity-40 mx-2">|</span>
                <span className="text-sm opacity-40">{activeImage + 1} / {product.images.length}</span>
              </div>
            </motion.div>
            
            {/* Thumbnail Strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-4 bg-black/50 backdrop-blur-md rounded-2xl">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i) }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-[#ff004c]' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
