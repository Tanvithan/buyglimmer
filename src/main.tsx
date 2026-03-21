import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import './index.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, User, X, Truck, Shield,
  Package, Gem, Trash2, LogOut, Heart, ChevronRight,
  CheckCircle, Edit2, Menu,
  Instagram, Twitter, Facebook, ArrowRight, Mail,
  RotateCcw, MapPin, Box, AlertCircle, ExternalLink, QrCode
} from 'lucide-react'
import About from './pages/About'
import Contact from './pages/Contact'
import Collections from './pages/Collections'
import FAQ from './pages/FAQ'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Shipping from './pages/Shipping'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import { productApi } from './services/productApi'
import { addressApi } from './services/addressApi'
import { cartApi } from './services/cartApi'
import { userApi } from './services/userApi'
import { couponApi } from './services/couponApi'
import { deliveryApi } from './services/deliveryApi'
import { orderApi } from './services/orderApi'
import { returnApi } from './services/returnApi'
import { refundApi } from './services/refundApi'
import { sabbpePaymentApi } from './services/sabbpePaymentApi'

// Setup global fetch interceptor to handle expiring tokens
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('auth-expired'));
  }
  return response;
};

// --- PRODUCTS DATA MOVED TO ./data/products.ts ---

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [wishlist, setWishlist] = useState<any[]>([])
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [apiProducts, setApiProducts] = useState<any[]>([])
  const [, setLoadingProducts] = useState(true)
  const [instantBuyItem, setInstantBuyItem] = useState<any>(null)

  const checkoutItems = instantBuyItem ? [instantBuyItem] : cart;

  const fetchCartData = async () => {
    try {
      const items = await cartApi.get();
      // Initialize with API products securely
      const productSource = apiProducts;
      const mapped = items.map((item: any) => {
        const product = productSource.find((p: any) => p.id === item.productId);
        return {
          cartId: item.cartItemId,
          id: item.productId,
          variantId: item.variantId,
          name: item.productName,
          price: Number(item.unitPrice),
          images: product?.images || ['https://images.unsplash.com/photo-1557821552-17105176677c?w=400'],
          quantity: item.quantity,
          color: 'Default',
          size: 'M'
        };
      });
      setCart(mapped);
    } catch (e) {
      console.error('Failed to fetch cart', e);
    }
  };

  const fetchOrdersData = async () => {
    try {
      const sums = await orderApi.list();
      let defaultAddr: any = null;
      try {
        const addrs = await addressApi.getAddresses();
        if (addrs && addrs.length > 0) {
          defaultAddr = addrs.find((a: any) => a.addressType === 'Home' || a.type === 'Home') || addrs[0];
        }
      } catch (e) { }

      const mapped = await Promise.all(sums.map(async (o: any) => {
        let realItems = [];
        try {
          const thickDetail = await orderApi.getDetail(o.orderId);
          realItems = thickDetail.items?.map((it: any) => ({
            name: it.productName,
            price: it.price,
            qty: it.quantity,
            color: '',
            colorHex: '',
            image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600'
          })) || [];
        } catch (e) { }

        return {
          id: o.orderId,
          date: o.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: o.status || 'Processing',
          total: Number(o.totalAmount),
          items: realItems.length > 0 ? realItems : [{ name: 'Order Package', price: Number(o.totalAmount), image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600' }],
          timeline: [
            { status: 'Order Placed', date: o.createdAt?.split('T')[0], completed: true },
            { status: 'Processing', date: o.status !== 'pending' ? o.createdAt?.split('T')[0] : null, completed: o.status !== 'pending' },
            { status: 'Shipped', date: null, completed: o.status === 'Shipped' || o.status === 'Delivered' },
            { status: 'Delivered', date: null, completed: o.status === 'Delivered' }
          ],
          shippingAddress: {
            name: o.customerName || defaultAddr?.name || 'Customer',
            address: o.addressLine || defaultAddr?.addressLine || defaultAddr?.addressLine1 || 'Address on file',
            city: o.city || defaultAddr?.city || '',
            state: o.state || defaultAddr?.state || '',
            pincode: o.pincode || defaultAddr?.pincode || '',
            phone: o.phone || defaultAddr?.phone || ''
          },
        };
      }));
      setOrders(mapped);
    } catch (e) {
      console.warn('Failed to fetch orders, defaulting empty', e);
      setOrders([]);
    }
  };

  const fetchAddressesData = async () => {
    try {
      const addrs = await addressApi.getAddresses();
      setSavedAddresses(addrs.map((a: any) => ({
        id: a.addressId || a.id,
        name: a.name || 'Customer',
        address: a.addressLine || a.addressLine1 || '',
        city: a.city || '',
        state: a.state || '',
        pincode: a.pincode || '',
        phone: a.phone || '',
        isDefault: a.addressType === 'Home' || a.type === 'Home'
      })));
      if (addrs.length > 0) setSelectedSavedAddress(addrs[0].addressId || addrs[0].id);
    } catch (e) { /* silent fail */ }
  };

  const handleLogin = (user: any) => {
    if (!user) return;
    setIsLoggedIn(true)
    setUserProfile({
      name: user.name || user.sub || 'User',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || 'No address set',
      avatar: (user.name || user.sub || 'U').substring(0, 2).toUpperCase()
    })

    // Crucial: Update the token for all APIs from the freshly stored token!
    const freshToken = localStorage.getItem('token');
    if (freshToken) {
      productApi.setToken(freshToken);
      addressApi.setToken(freshToken);
      cartApi.setToken(freshToken);
      couponApi.setToken(freshToken);
      deliveryApi.setToken(freshToken);
      orderApi.setToken(freshToken);
      returnApi.setToken(freshToken);
      refundApi.setToken(freshToken);
    }

    if (user.customerId || user.id) {
      const cid = user.customerId || user.id;
      cartApi.setCustomerId(cid);
      addressApi.setCustomerId(cid);
      userApi.setCustomerId(cid);
      couponApi.setCustomerId(cid);
      orderApi.setCustomerId(cid);
      returnApi.setCustomerId(cid);
      refundApi.setCustomerId(cid);
      fetchCartData();
      fetchOrdersData();
      fetchAddressesData();
      userApi.getProfile().then(profile => {
        if (profile) {
          setUserProfile({
            name: profile.name || 'User',
            email: profile.email || '',
            phone: profile.mobile || profile.phone || '',
            address: profile.address || 'No address set',
            avatar: (profile.name || 'U').substring(0, 2).toUpperCase()
          });
        }
      }).catch(e => console.error("Failed to load profile", e));
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCart([])
    setWishlist([])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUserProfile(null)
    cartApi.setToken('');
    cartApi.setCustomerId('');
    userApi.setCustomerId('');
  }

  useEffect(() => {
    const handleAuthExpired = () => handleLogout();
    window.addEventListener('auth-expired', handleAuthExpired as EventListener);
    return () => window.removeEventListener('auth-expired', handleAuthExpired as EventListener);
  }, []);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          productApi.setToken(token);
          addressApi.setToken(token);
          cartApi.setToken(token);
          couponApi.setToken(token);
          deliveryApi.setToken(token);
          orderApi.setToken(token);
          returnApi.setToken(token);
          refundApi.setToken(token);
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.customerId || user.id) {
              const cid = user.customerId || user.id;
              cartApi.setCustomerId(cid);
              addressApi.setCustomerId(cid);
              userApi.setCustomerId(cid);
              couponApi.setCustomerId(cid);
              orderApi.setCustomerId(cid);
              returnApi.setCustomerId(cid);
              refundApi.setCustomerId(cid);
              fetchCartData();
              fetchOrdersData();
              fetchAddressesData();
              userApi.getProfile().then(profile => {
                if (profile) {
                  setUserProfile({
                    name: profile.name || 'User',
                    email: profile.email || '',
                    phone: profile.mobile || profile.phone || '',
                    address: profile.address || 'No address set',
                    avatar: (profile.name || 'U').substring(0, 2).toUpperCase()
                  });

                  // Sync true DB database fields manually down to localStorage so it never lapses on refresh
                  const localCacheStr = localStorage.getItem('user');
                  if (localCacheStr) {
                    try {
                      const localCache = JSON.parse(localCacheStr);
                      localCache.name = profile.name;
                      localCache.email = profile.email;
                      localCache.phone = profile.mobile || profile.phone;
                      localCache.mobile = profile.mobile || profile.phone;
                      localStorage.setItem('user', JSON.stringify(localCache));
                    } catch (e) {
                      // Ignoring cache failure
                    }
                  }
                }
              }).catch(e => console.error("Failed to load profile", e));
            }
          }
        }

        const products = await productApi.list();

        // Map API products to local format
        const mappedProducts = products.map((p: any) => ({
          id: p.productId,
          name: p.name,
          category: p.brand || 'Clothing',
          price: Number(p.price),
          mrp: Number(p.mrp),
          images: p.imageUrl ? [p.imageUrl] : ['https://images.unsplash.com/photo-1557821552-17105176677c?w=400'],
          description: p.description,
          stock: p.stock,
          sizes: ['S', 'M', 'L', 'XL'],
          colors: [{ name: 'Default', hex: '#000000' }],
          specs: {},
          reviews: []
        }));

        setApiProducts(mappedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Do not fall back to demo data, just leave empty to reflect real DB state.
        setApiProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [])
  const [profileSection, setProfileSection] = useState<'menu' | 'edit' | 'orders'>('menu')

  // Load user profile from localStorage or use empty object
  const getInitialUserProfile = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return {
          name: user.name || user.sub || 'User',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || 'No address set',
          avatar: (user.name || user.sub || 'U').substring(0, 2).toUpperCase()
        };
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
      }
    }
    return null;
  };

  const [userProfile, setUserProfile] = useState<{ name: string; email: string; phone: string; address: string; avatar: string } | null>(getInitialUserProfile())
  useEffect(() => {
    if (location.pathname === '/payment-result' && (location.search.includes('status=SUCCESS') || location.search.includes('status=success'))) {
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      // Attempt to clear from backend as well asynchronously
      cartApi.get().then(items => {
        items.forEach((it: any) => cartApi.remove(it.cartItemId || it.id).catch(() => { }));
      }).catch(() => { });
    }
  }, [location.pathname, location.search]);

  const [orders, setOrders] = useState<any[]>([])
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '' })
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [upiScannerOpen, setUpiScannerOpen] = useState(false)
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>('')
  const [couponCode, setCouponCode] = useState('')
  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string | null>(null)



  const addToCart = async (p: any) => {
    if (!isLoggedIn) {
      setLoginPromptOpen(true);
      return;
    }

    // Avoid "Duplicate Key" on backend: if item already exists in cart, just increment its quantity
    const existingIndex = cart.findIndex(item => item.id === p.id);
    if (existingIndex !== -1) {
      const existingItem = cart[existingIndex];
      if (existingItem.cartId && typeof existingItem.cartId === 'string' && existingItem.cartId.length > 10) {
        updateCartQuantity(existingItem.cartId, existingIndex, 1);
      } else {
        // Locally mapped but not synchronized to backend properly, just increment local qty
        const newCart = [...cart];
        newCart[existingIndex] = { ...existingItem, quantity: (existingItem.quantity || 1) + 1 };
        setCart(newCart);
      }
      setCartOpen(true);
      return;
    }

    const tempCartId = Date.now().toString();
    setCart([...cart, { ...p, cartId: tempCartId, quantity: 1 }])
    setCartOpen(true)

    try {
      const res = await cartApi.add(p.id, null, 1);
      setCart(currentCart => currentCart.map(item =>
        item.cartId === tempCartId ? { ...item, cartId: res.cartItemId, variantId: res.variantId } : item
      ));
    } catch (e) {
      console.error('Failed to add to cart on backend', e);
      setCart(currentCart => currentCart.filter(item => item.cartId !== tempCartId));
    }
  }

  const removeFromCart = async (cartItemId: string, index: number) => {
    const itemToRemove = cart[index];
    const newCart = cart.filter((_, idx) => idx !== index);
    setCart(newCart);

    if (cartItemId && typeof cartItemId === 'string' && cartItemId.length > 10) {
      try {
        await cartApi.remove(cartItemId);
      } catch (e) {
        console.error('Failed to remove item', e);
        setCart([...newCart, itemToRemove]);
      }
    }
  };

  const updateCartQuantity = async (cartItemId: string, index: number, increment: number) => {
    const item = cart[index];
    const newQty = (item.quantity || 1) + increment;

    if (newQty <= 0) {
      removeFromCart(cartItemId, index);
      return;
    }

    const newCart = [...cart];
    newCart[index] = { ...item, quantity: newQty };
    setCart(newCart);

    if (cartItemId && typeof cartItemId === 'string' && cartItemId.length > 10) {
      try {
        await cartApi.update(cartItemId, newQty);
      } catch (e) {
        console.error('Failed to update quantity', e);
        const rollbackCart = [...cart];
        rollbackCart[index] = item;
        setCart(rollbackCart);
      }
    }
  };

  const toggleWishlist = (p: any) => {
    if (wishlist.find(item => item.id === p.id)) {
      setWishlist(wishlist.filter(item => item.id !== p.id))
    } else {
      setWishlist([...wishlist, p])
    }
  }

  // Force usage of API data exclusively
  const productSource = apiProducts;
  const filteredProducts = activeCategory === 'All'
    ? productSource
    : productSource.filter(p => p.category === activeCategory)

  const handleNavigation = (section: string) => {
    if (section === 'shop' || section === 'hero') {
      if (location.pathname !== '/') navigate('/')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } else if (section === 'drops' || section === 'products') {
      navigate('/collections')
      window.scrollTo(0, 0)
    } else {
      navigate('/' + section)
      window.scrollTo(0, 0)
    }
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-mesh overflow-hidden">
        <div className="mesh-grid absolute inset-0"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-[#050508]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-4 md:py-5 flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-black cursor-pointer tracking-tighter" onClick={() => { if (location.pathname === '/') window.scrollTo(0, 0); }}>
            INDUMENTI<span className="text-[#ff004c]">.</span>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {['Shop', 'Collections', 'About', 'Contact', 'Login'].map((item) => (
              <Link
                key={item}
                to={item === 'Shop' ? '/' : item === 'Collections' ? '/collections' : item === 'Login' ? '/login' : `/${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-widest cursor-pointer opacity-60 hover:opacity-100 hover:text-[#ff004c] transition-all"
                onClick={(e) => {
                  if (item === 'Shop' && location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (item === 'Collections') {
                    setActiveCategory('All');
                    window.scrollTo(0, 0);
                  }
                }}
              >
                {item}
              </Link>
            ))}
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* Mobile Cart/Wishlist - Visible on top right */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="relative p-2 opacity-60 hover:opacity-100 transition-all" onClick={() => isLoggedIn ? setWishlistOpen(true) : setLoginPromptOpen(true)}>
              <Heart size={22} className={wishlist.length > 0 ? "fill-[#ff004c] text-[#ff004c]" : ""} />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-[#ff004c] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">{wishlist.length}</span>}
            </button>
            <button className="relative p-2" onClick={() => isLoggedIn ? setCartOpen(true) : setLoginPromptOpen(true)}>
              <ShoppingBag size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#ff004c] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse">{cart.length}</span>}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button className="relative p-2 opacity-60 hover:opacity-100 transition-all" onClick={() => isLoggedIn ? setWishlistOpen(true) : setLoginPromptOpen(true)}>
              <Heart size={22} className={wishlist.length > 0 ? "fill-[#ff004c] text-[#ff004c]" : ""} />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-[#ff004c] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">{wishlist.length}</span>}
            </button>
            <button className="relative p-2" onClick={() => isLoggedIn ? setProfileOpen(true) : navigate('/login')}><User size={22} /></button>
            <button className="relative p-2" onClick={() => isLoggedIn ? setCartOpen(true) : setLoginPromptOpen(true)}>
              <ShoppingBag size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#ff004c] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse">{cart.length}</span>}
            </button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#050508]/95 backdrop-blur-xl border-b border-white/10 px-4 py-4">
            <div className="flex flex-col gap-4">
              {['Shop', 'Collections', 'About', 'Contact', 'Login'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Shop' ? '/' : item === 'Collections' ? '/collections' : item === 'Login' ? '/login' : `/${item.toLowerCase()}`}
                  className="text-sm font-bold uppercase tracking-widest cursor-pointer opacity-60 hover:opacity-100 hover:text-[#ff004c] transition-all py-2"
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (item === 'Shop' && location.pathname === '/') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (item === 'Collections') {
                      setActiveCategory('All');
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  {item}
                </Link>
              ))}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <button className="relative p-3 flex flex-col items-center justify-center gap-1 bg-white/5 rounded-xl transition-all" onClick={() => { setProfileOpen(true); setMenuOpen(false); }}>
                  <User size={18} /> <span className="text-[10px] font-bold uppercase tracking-widest">Account</span>
                </button>
                <button className="relative p-3 flex flex-col items-center justify-center gap-1 bg-white/5 rounded-xl transition-all" onClick={() => { if (isLoggedIn) { setWishlistOpen(true); setMenuOpen(false); } else { setLoginPromptOpen(true); setMenuOpen(false); } }}>
                  <Heart size={18} className={wishlist.length > 0 ? "fill-[#ff004c] text-[#ff004c]" : ""} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
                  {wishlist.length > 0 && <span className="absolute top-1 right-1 bg-[#ff004c] text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">{wishlist.length}</span>}
                </button>
                <button className="relative p-3 flex flex-col items-center justify-center gap-1 bg-white/5 rounded-xl transition-all" onClick={() => { if (isLoggedIn) { setCartOpen(true); setMenuOpen(false); } else { setLoginPromptOpen(true); setMenuOpen(false); } }}>
                  <ShoppingBag size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Bag</span>
                  {cart.length > 0 && <span className="absolute top-1 right-1 bg-[#ff004c] text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">{cart.length}</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={
          <>
            {/* Hero Section */}
            <section id="hero" className="max-w-[1400px] mx-auto pt-28 md:pt-40 px-4 md:px-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 min-h-[90vh]">
              <div className="flex-1 w-full text-center md:text-left">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                  <span className="inline-block px-4 py-2 bg-[#ff004c]/10 text-[#ff004c] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#ff004c]/20">Luxury Concept 2026</span>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[0.9] my-4 md:my-6 tracking-tighter">Beyond <span className="bg-gradient-to-r from-[#ff004c] to-[#ff7b00] bg-clip-text text-transparent">Style.</span><br />Into Future.</h1>
                  <p className="text-base md:text-lg text-[#94a3b8] max-w-lg mx-auto md:mx-0 mb-8 md:mb-10 leading-relaxed">The definitive collection of streetwear and fine accessories for the modern elite.</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                    <button onClick={() => navigate('/')} className="px-8 md:px-10 py-3 md:py-4 bg-[#ff004c] text-white rounded-xl font-bold shadow-[0_10px_30px_-10px_rgba(255,0,76,0.3)] hover:-translate-y-1 transition-all text-sm md:text-base">Shop Now</button>
                    <button onClick={() => navigate('/collections')} className="inline-block px-8 md:px-10 py-3 md:py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl font-bold hover:bg-white/10 transition-all text-sm md:text-base text-center">View Drops</button>
                  </div>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="relative group w-full md:w-1/2 max-w-md md:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                  alt="Fashion"
                  className="rounded-[30px] md:rounded-[40px] border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 w-full h-auto aspect-square object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800'; }}
                />
                <div className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 bg-[#ff004c] px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black -rotate-6 shadow-2xl tracking-widest text-[10px] md:text-xs">ELITE DROP</div>
              </motion.div>
            </section>

            {/* Categories Section removed perfectly per user request! */}

            {/* Collections Section - Completely Dynamic based on Backend productSource! */}
            <section id="collections" className="max-w-[1400px] mx-auto py-20 md:py-32 px-4 md:px-10">
              <div className="text-center mb-16 space-y-4">
                <span className="inline-block px-4 py-1.5 bg-[#ff004c]/10 text-[#ff004c] text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-[#ff004c]/20">The 2026 Drops</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Curated <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Collections.</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from(new Set((productSource || []).map((p: any) => p.category))).filter((c: any) => c !== 'All').map((category: any, i) => {

                  // Restore premium editorial static images exactly for the visual cards!
                  let coverImage = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600';
                  if (category === 'Clothing') {
                    coverImage = 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600';
                  } else if (category === 'Accessories') {
                    coverImage = 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600';
                  } else if (category === 'Jewelry') {
                    coverImage = 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600';
                  } else {
                    const coverProduct = productSource.find((p: any) => p.category === category);
                    coverImage = coverProduct?.images?.[0] || coverImage;
                  }

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => { setActiveCategory(category); navigate('/collections'); window.scrollTo(0, 0); }}
                      className="group cursor-pointer bg-white/5 rounded-[40px] overflow-hidden border border-white/10 hover:border-[#ff004c]/50 transition-all relative"
                    >
                      <div className="h-[400px] md:h-[500px] overflow-hidden">
                        <img
                          src={coverImage}
                          alt={category}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600'; }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-10 transform group-hover:-translate-y-2 transition-transform">
                        <span className="text-[#ff004c] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Curated {category}</span>
                        <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                          {category} Collection
                          <ArrowRight size={24} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#ff004c]" />
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Features Bar */}
            <section className="bg-white/5 border-y border-white/5 py-8 md:py-12">
              <div className="max-w-[1400px] mx-auto flex flex-wrap justify-around gap-6 md:gap-10 px-4 md:px-6">
                <div className="flex items-center gap-4 text-[#ff004c] font-black uppercase tracking-widest text-[10px]"><Truck size={20} /> <span>Free Global Ship</span></div>
                <div className="flex items-center gap-4 text-[#ff004c] font-black uppercase tracking-widest text-[10px]"><Shield size={20} /> <span>Secure Vault</span></div>
                <div className="flex items-center gap-4 text-[#ff004c] font-black uppercase tracking-widest text-[10px]"><Gem size={20} /> <span>Luxury Grade</span></div>
              </div>
            </section>
          </>
        } />

        <Route path="/collections" element={
          <Collections
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredProducts={filteredProducts}
            allProducts={productSource}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            isLoggedIn={isLoggedIn}
            setLoginPromptOpen={setLoginPromptOpen}
          />
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/product/:id" element={
          <ProductDetails
            addToCart={addToCart}
            setCheckoutOpen={setCheckoutOpen}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            isLoggedIn={isLoggedIn}
            setLoginPromptOpen={setLoginPromptOpen}
            buyInstinctively={(p: any) => {
              setInstantBuyItem({
                ...p,
                cartId: 'instant_' + p.id,
                variantId: null,
                quantity: 1,
                price: p.price,
                images: p.images || [p.imageUrl]
              });
              setCheckoutStep(1);
              setCheckoutOpen(true);
            }}
          />
        } />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/payment-result" element={
          <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center">
            {location.search.includes('status=SUCCESS') || location.search.includes('status=success') ? (
              <>
                <CheckCircle size={80} className="text-green-500 mb-6" />
                <h1 className="text-4xl font-black mb-4">Payment Successful!</h1>
                <p className="opacity-60 mb-8 max-w-md mx-auto">Your order has been formally placed and your transaction is complete.</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-xs opacity-60 mb-8 text-left max-w-sm w-full">
                  <p>Transaction ID: {new URLSearchParams(location.search).get('txnId') || new URLSearchParams(location.search).get('txnid')}</p>
                  <p className="mt-2">Status: SUCCESS</p>
                </div>
              </>
            ) : (
              <>
                <X size={80} className="text-[#ff004c] mb-6" />
                <h1 className="text-4xl font-black mb-4">Payment Failed</h1>
                <p className="opacity-60 mb-8 max-w-md mx-auto">There was an issue processing your transaction. Please try again.</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-xs opacity-60 mb-8 text-left max-w-sm w-full">
                  <p>Status: {new URLSearchParams(location.search).get('status')}</p>
                </div>
              </>
            )}
            <button onClick={() => { navigate('/'); window.scrollTo(0, 0); }} className="px-10 py-4 bg-[#ff004c] text-white rounded-xl font-bold hover:brightness-110 transition-all uppercase tracking-widest text-sm">Return Home</button>
          </div>
        } />
      </Routes>

      <footer className="w-full bg-[#030305] border-t border-white/5 pt-16 pb-8 px-4 mt-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="text-2xl font-black tracking-tighter">INDUMENTI<span className="text-[#ff004c]">.</span></div>
              <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xs">
                The vanguard of elite streetwear. Limited drops, infinite style.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-[#ff004c]/20 hover:text-[#ff004c] transition-all border border-white/5"><Instagram size={18} /></a>
                <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-[#ff004c]/20 hover:text-[#ff004c] transition-all border border-white/5"><Twitter size={18} /></a>
                <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-[#ff004c]/20 hover:text-[#ff004c] transition-all border border-white/5"><Facebook size={18} /></a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#ff004c]">Navigation</h4>
              <ul className="space-y-4 text-sm font-bold opacity-60">
                <li><Link to="/" className="hover:opacity-100 hover:text-white transition-all">All Products</Link></li>
                <li><Link to="/collections" className="hover:opacity-100 hover:text-white transition-all">Collections</Link></li>
                <li><Link to="/about" className="hover:opacity-100 hover:text-white transition-all">About Us</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#ff004c]">Support</h4>
              <ul className="space-y-4 text-sm font-bold opacity-60">
                <li><Link to="/faq" className="hover:opacity-100 hover:text-white transition-all">Help / FAQ</Link></li>
                <li><Link to="/shipping" className="hover:opacity-100 hover:text-white transition-all">Shipping & Returns</Link></li>
                <li><Link to="/contact" className="hover:opacity-100 hover:text-white transition-all">Contact Support</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#ff004c]">Newsletter</h4>
              <p className="text-sm text-[#94a3b8]">Join for exclusive access to drops.</p>
              <div className="flex bg-white/5 rounded-2xl border border-white/10 overflow-hidden focus-within:border-[#ff004c]/50 transition-all">
                <div className="pl-4 flex items-center text-[#ff004c]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-transparent px-3 py-4 text-sm outline-none placeholder:text-white/20"
                />
                <button className="bg-[#ff004c] px-4 hover:brightness-110 transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
              © 2026 INDUMENTI LUXURY GRP. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-40">
              <Link to="/terms" className="hover:opacity-100 hover:text-white transition-all">Terms</Link>
              <Link to="/privacy" className="hover:opacity-100 hover:text-white transition-all">Privacy</Link>
              <a href="#" className="hover:opacity-100 hover:text-white transition-all">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sidebars Component Logic */}
      <AnimatePresence>
        {(profileOpen || cartOpen || wishlistOpen) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCartOpen(false); setProfileOpen(false); setWishlistOpen(false) }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        )}

        {/* Login Prompt Modal */}
        <AnimatePresence>
          {loginPromptOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLoginPromptOpen(false)} className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-full max-w-md p-4 sm:p-6">
                <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
                    <p className="text-slate-400 mb-6">Please login to access your cart and checkout.</p>
                    <div className="space-y-3">
                      <button onClick={() => { setLoginPromptOpen(false); navigate('/login'); }} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-xl transition-all">
                        Login
                      </button>
                      <button onClick={() => { setLoginPromptOpen(false); navigate('/register'); }} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all border border-white/10">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </AnimatePresence>

      {/* Profile Sidebar */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 right-0 h-full w-full sm:w-[450px] z-[60] bg-[#08080c] border-l border-white/10 p-6 sm:p-10 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter">{profileSection === 'menu' ? 'Account' : profileSection === 'edit' ? 'Edit Profile' : 'My Orders'}</h2>
              <X onClick={() => { setProfileOpen(false); setProfileSection('menu'); }} className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#ff004c] transition-all" />
            </div>

            {profileSection === 'menu' ? (
              <>
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#ff004c] rounded-full flex items-center justify-center text-lg sm:text-2xl font-black">{userProfile?.avatar || 'U'}</div>
                  <div>
                    <h3 className="text-xl font-black">{userProfile?.name || 'User'}</h3>
                    <p className="text-sm opacity-40">{userProfile?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div onClick={() => setProfileSection('edit')} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-sm font-bold flex items-center gap-3"><Edit2 size={18} /> Edit Profile</span>
                    <ChevronRight size={14} />
                  </div>
                  <div onClick={() => setProfileSection('orders')} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-sm font-bold flex items-center gap-3"><Package size={18} /> My Orders</span>
                    <ChevronRight size={14} />
                  </div>
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-sm font-bold flex items-center gap-3"><Heart size={18} /> Wishlist</span>
                    <ChevronRight size={14} />
                  </div>
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 text-[#ff004c] transition-all mt-4" onClick={() => { handleLogout(); setProfileOpen(false); }}>
                    <span className="text-sm font-bold flex items-center gap-3"><LogOut size={18} /> Sign Out</span>
                  </div>
                </div>
              </>
            ) : profileSection === 'edit' ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setProfileSection('menu')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><ChevronRight className="rotate-180" size={18} /></button>
                  <span className="text-sm font-bold">Back to Menu</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest opacity-60 mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={userProfile?.name || ''}
                      onChange={(e) => setUserProfile({ name: e.target.value, email: userProfile?.email || '', phone: userProfile?.phone || '', address: userProfile?.address || '', avatar: e.target.value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest opacity-60 mb-2 block">Email</label>
                    <input
                      type="email"
                      value={userProfile?.email || ''}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value } as any)}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest opacity-60 mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={userProfile?.phone || ''}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value } as any)}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest opacity-60 mb-2 block">Address</label>
                    <input
                      type="text"
                      value={userProfile?.address || ''}
                      onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value } as any)}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (userProfile) {
                        try {
                          await userApi.updateProfile(userProfile.name, userProfile.email, userProfile.phone);

                          // Sync the frontend cache to prevent reversion on hard refresh!
                          const oldUserCacheStr = localStorage.getItem('user');
                          if (oldUserCacheStr) {
                            const oldUserCache = JSON.parse(oldUserCacheStr);
                            oldUserCache.name = userProfile.name;
                            oldUserCache.email = userProfile.email;
                            oldUserCache.phone = userProfile.phone;
                            oldUserCache.mobile = userProfile.phone;
                            localStorage.setItem('user', JSON.stringify(oldUserCache));
                          }

                          setProfileSection('menu');
                          alert('Profile updated successfully!');
                        } catch (e) {
                          alert('Failed to update profile');
                        }
                      }
                    }}
                    className="w-full py-4 bg-[#ff004c] text-white rounded-xl font-bold uppercase tracking-widest text-xs mt-4 hover:brightness-110 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setProfileSection('menu')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><ChevronRight className="rotate-180" size={18} /></button>
                  <span className="text-sm font-bold">Back to Menu</span>
                </div>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white/5 rounded-2xl p-5 border border-white/10 cursor-pointer hover:border-[#ff004c]/30 transition-all"
                      onClick={async () => {
                        setSelectedOrder(order);
                        setOrderDetailOpen(true);

                        try {
                          const thickDetail = await orderApi.getDetail(order.id);
                          const richItems = thickDetail.items?.map((it: any) => ({
                            name: it.productName,
                            price: it.price,
                            qty: it.quantity,
                            image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400'
                          })) || order.items;

                          setSelectedOrder({
                            ...order,
                            items: richItems,
                            total: thickDetail.totalAmount
                          });
                        } catch (e) { /* keep summary fallback */ }
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-black text-sm">{order.id}</p>
                          <p className="text-xs opacity-40">{order.date}</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>{order.status}</span>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={order.items[0].image}
                          alt={order.items[0].name}
                          className="w-16 h-16 rounded-xl object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200'; }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white">{order.items[0].name}</h4>
                          <p className="text-[#ff004c] font-black">₹{order.total}</p>
                          {order.items[0].color && (
                            <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: order.items[0].colorHex }}
                              ></span>
                              {order.items[0].color}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Order Tracking Timeline */}
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Track Order</p>
                        <div className="flex items-center justify-between">
                          <div className={`flex flex-col items-center ${order.status !== 'Processing' ? 'text-green-500' : 'opacity-30'}`}>
                            <CheckCircle size={16} />
                            <span className="text-[8px] mt-1">Ordered</span>
                          </div>
                          <div className={`flex-1 h-0.5 mx-2 ${order.status !== 'Processing' ? 'bg-green-500' : 'bg-white/10'}`}></div>
                          <div className={`flex flex-col items-center ${order.status === 'Shipped' || order.status === 'Delivered' ? 'text-green-500' : 'opacity-30'}`}>
                            <Truck size={16} />
                            <span className="text-[8px] mt-1">Shipped</span>
                          </div>
                          <div className={`flex-1 h-0.5 mx-2 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-white/10'}`}></div>
                          <div className={`flex flex-col items-center ${order.status === 'Delivered' ? 'text-green-500' : 'opacity-30'}`}>
                            <Package size={16} />
                            <span className="text-[8px] mt-1">Delivered</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-[10px] font-bold text-[#ff004c] flex items-center justify-center gap-1">
                          <ExternalLink size={10} /> View Details
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {orderDetailOpen && selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOrderDetailOpen(false)} className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-4 z-[80] bg-[#08080c] rounded-3xl border border-white/10 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black">Order Details</h2>
                  <p className="text-sm opacity-60">{selectedOrder.id}</p>
                </div>
                <X onClick={() => setOrderDetailOpen(false)} className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#ff004c] transition-all" size={24} />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Order Status & Items */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${selectedOrder.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                      selectedOrder.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>{selectedOrder.status}</span>
                    <span className="text-xs opacity-60">{selectedOrder.date}</span>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200'; }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <p className="text-xs opacity-60 flex items-center gap-2 mt-1">
                            {item.color && (
                              <>
                                <span
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: item.colorHex }}
                                ></span>
                                {item.color}
                              </>
                            )}
                            {item.qty && <span>• Qty: {item.qty}</span>}
                          </p>
                        </div>
                        <p className="font-black text-[#ff004c]">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-xl font-black">₹{selectedOrder.total}</span>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                      <Truck size={18} className="text-[#ff004c]" /> Shipment Tracking
                    </h3>
                    <div className="flex items-center gap-2">
                      {selectedOrder.trackingNumber && (
                        <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-mono">
                          {selectedOrder.trackingNumber}
                        </span>
                      )}
                      <button
                        onClick={async () => {
                          try {
                            const res = await deliveryApi.getDetail(selectedOrder.id);
                            alert(`Delivery Status: ${res.status} | Location: ${res.currentLocation || 'Unknown'} | Courier: ${res.courierName}`);
                          } catch (e) {
                            alert('Live tracking not available for this mockup order yet.');
                          }
                        }}
                        className="text-[10px] font-bold text-[#ff004c] bg-[#ff004c]/10 px-3 py-1 rounded-full hover:bg-[#ff004c]/20 transition-all font-mono"
                      >Live Sync</button>
                      <button
                        onClick={async () => {
                          try {
                            await deliveryApi.updateStatus(selectedOrder.id, 'Delivered', 'Customer Doorstep', 'Simulated frontend dropoff');
                            alert(`Delivery officially logged as Delivered inside DB!`);
                          } catch (e) {
                            alert('Delivery not found in DB or status update failed.');
                          }
                        }}
                        className="text-[10px] font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full hover:bg-green-500/20 transition-all font-mono"
                      >Mark Delivered</button>
                    </div>
                  </div>
                  <div className="relative">
                    {selectedOrder.timeline.map((event: any, idx: number) => (
                      <div key={idx} className="flex gap-4 pb-4 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${event.completed ? 'bg-green-500' : 'bg-white/20'}`}></div>
                          {idx < selectedOrder.timeline.length - 1 && (
                            <div className={`w-0.5 h-full ${event.completed ? 'bg-green-500/30' : 'bg-white/10'} mt-1`}></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className={`text-sm font-bold ${event.completed ? 'text-white' : 'opacity-40'}`}>{event.status}</p>
                          {event.date && (
                            <p className="text-xs opacity-60 mt-0.5">{event.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                    <MapPin size={18} className="text-[#ff004c]" /> Shipping Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Carrier</span>
                      <span className="font-bold">{selectedOrder.carrier}</span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="opacity-60">Tracking No.</span>
                        <span className="font-mono text-xs">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Est. Delivery</span>
                      <span className="font-bold text-blue-400">{selectedOrder.estimatedDelivery}</span>
                    </div>
                    {selectedOrder.actualDelivery && (
                      <div className="flex justify-between text-sm">
                        <span className="opacity-60">Delivered On</span>
                        <span className="font-bold text-green-400">{selectedOrder.actualDelivery}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/10 mt-4 pt-4">
                    <p className="text-xs font-bold opacity-60 mb-2">Delivery Address</p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.name}<br />
                      {selectedOrder.shippingAddress.address}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}<br />
                      <span className="opacity-60">{selectedOrder.shippingAddress.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Return & Exchange */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                    <RotateCcw size={18} className="text-[#ff004c]" /> Return & Exchange
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <AlertCircle size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold">Return Policy</p>
                        <p className="text-xs opacity-60 mt-1">
                          Eligible for return within 7 days of delivery. Item must be unused with tags intact.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={async () => {
                          try {
                            const retRes = await returnApi.create(selectedOrder.id, 'Did not fit', 'Requested via automated frontend');
                            alert(`Return #${retRes.returnId} logged officially! Status: ${retRes.status}`);

                            // Automatically chain Refund for demonstration of integrated logic
                            const refRes = await refundApi.create(retRes.returnId, 'PAY-MOCK123', selectedOrder.total, 'Auto-approved refund');
                            alert(`Refund #${refRes.refundId} processed! Amount: ₹${refRes.amount}`);
                          } catch (err) {
                            alert('Failed to log Return/Refund. DB dependencies might be missing.');
                          }
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl text-center hover:bg-white/10 transition-all focus:ring-1 focus:ring-[#ff004c]"
                      >
                        <RotateCcw size={20} className="mx-auto mb-2 text-[#ff004c]" />
                        <span className="text-xs font-bold">Request Return</span>
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const returns = await returnApi.list();
                            const refunds = await refundApi.list();
                            alert(`Found ${returns.length} returns and ${refunds.length} refunds on file.`);
                          } catch (err) {
                            alert('Unable to fetch history.');
                          }
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl text-center hover:bg-white/10 transition-all focus:ring-1 focus:ring-blue-400"
                      >
                        <Box size={20} className="mx-auto mb-2 text-blue-400" />
                        <span className="text-xs font-bold">Check History</span>
                      </button>
                    </div>
                    <button className="w-full p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center hover:bg-blue-500/20 transition-all">
                      <span className="text-xs font-bold text-blue-400 flex items-center justify-center gap-2">
                        <ExternalLink size={14} /> Track with Carrier
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setOrderDetailOpen(false)}
                  className="flex-1 py-3 bg-white/10 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
                >
                  Close
                </button>
                <button className="flex-1 py-3 bg-[#ff004c] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
                  Need Help?
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Sidebar */}
      <AnimatePresence>
        {wishlistOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 right-0 h-full w-full sm:w-[450px] z-[60] bg-[#08080c] border-l border-white/10 p-10 flex flex-col">
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-xl font-black uppercase tracking-tighter text-[#ff004c]">Saved Signal ({wishlist.length})</h2>
              <X onClick={() => setWishlistOpen(false)} className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#ff004c] transition-all" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
              {wishlist.map((item) => (
                <div key={item.id} className="flex items-center gap-6 pb-6 border-b border-white/5 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer" onClick={() => { navigate(`/product/${item.id}`); setWishlistOpen(false); }}>
                    <img
                      src={item.images[0]}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-sm mb-1 uppercase tracking-tighter cursor-pointer hover:text-[#ff004c] transition-colors" onClick={() => { navigate(`/product/${item.id}`); setWishlistOpen(false); }}>{item.name}</h4>
                    <p className="text-[#ff004c] font-black">₹{item.price}</p>
                    <button onClick={() => { addToCart(item); setWishlistOpen(false); }} className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-40 hover:opacity-100 transition-all">+ Add to Bag</button>
                  </div>
                  <X size={16} onClick={() => toggleWishlist(item)} className="cursor-pointer opacity-30 hover:opacity-100 transition-all hover:text-[#ff004c]" />
                </div>
              ))}
              {wishlist.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 opacity-30">
                  <Heart size={40} className="mb-4" />
                  <p className="text-center font-bold">Your wishlist is currently void.</p>
                </div>
              )}
            </div>
            {wishlist.length > 0 && <button onClick={() => { setWishlistOpen(false); navigate('/'); handleNavigation('products'); }} className="mt-auto w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-[#ff004c] hover:text-white transition-all">Keep Hunting</button>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 right-0 h-full w-full sm:w-[450px] z-[60] bg-[#08080c] border-l border-white/10 p-6 sm:p-10 flex flex-col">
            <div className="flex justify-between items-center mb-8 sm:mb-16">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter">Shopping Bag ({cart.length})</h2>
              <X onClick={() => setCartOpen(false)} className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#ff004c] transition-all" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 sm:space-y-8">
              {cart.map((item, i) => (
                <div key={item.cartId} className="flex items-center gap-3 sm:gap-6 pb-4 sm:pb-6 border-b border-white/5">
                  <img
                    src={item.images[0]}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200'; }}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                    <p className="text-[#ff004c] font-black">₹{item.price}</p>
                    {item.color && (
                      <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                        <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: item.colorHex || item.color }}></span>
                        {item.color}
                      </p>
                    )}
                    {item.size && (
                      <p className="text-xs opacity-60 mt-1">Size: {item.size}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Trash2 size={16} onClick={() => removeFromCart(item.cartId, i)} className="cursor-pointer opacity-30 hover:opacity-100 transition-all hover:text-[#ff004c]" />
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
                      <button onClick={() => updateCartQuantity(item.cartId, i, -1)} className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 bg-white/10 rounded">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity || 1}</span>
                      <button onClick={() => updateCartQuantity(item.cartId, i, 1)} className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 bg-white/10 rounded">+</button>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center opacity-30 mt-20">Your bag is empty.</p>}
            </div>
            {cart.length > 0 && <button onClick={() => isLoggedIn ? setCheckoutOpen(true) : setLoginPromptOpen(true)} className="mt-auto w-full py-4 sm:py-5 bg-[#ff004c] text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all text-sm sm:text-base">Proceed to Checkout</button>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCheckoutOpen(false); setInstantBuyItem(null); setCheckoutStep(1); }} className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-70 flex items-center justify-center p-2 md:p-4 pointer-events-none overflow-y-auto">
              <div className="bg-[#08080c] border border-white/10 rounded-[24px] md:rounded-[40px] p-5 md:p-8 max-w-4xl w-full pointer-events-auto my-4 md:my-8">
                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${checkoutStep >= step ? 'bg-[#ff004c] text-white' : 'bg-white/10 text-white/30'
                        }`}>
                        {checkoutStep > step ? <CheckCircle size={20} /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-20 h-0.5 mx-2 ${checkoutStep > step ? 'bg-[#ff004c]' : 'bg-white/10'
                          }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">
                    {checkoutStep === 1 ? 'Shipping Details' : checkoutStep === 2 ? 'Review Order' : 'Payment Method'}
                  </h2>
                  <X onClick={() => { setCheckoutOpen(false); setInstantBuyItem(null); setCheckoutStep(1); }} className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#ff004c] transition-all" />
                </div>

                {/* Step 1: Shipping */}
                {checkoutStep === 1 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                    {/* Order Summary - First on mobile */}
                    <div className="order-1 lg:order-1">
                      <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Order Summary</h3>
                      <div className="space-y-3 mb-4 max-h-[180px] overflow-y-auto">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => { setSelectedSavedAddress(addr.id); setShippingInfo({ name: addr.name, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, phone: addr.phone, email: '' }); }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedSavedAddress === addr.id
                              ? 'bg-[#ff004c]/10 border-[#ff004c] text-white'
                              : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-sm">{addr.name} {addr.isDefault && <span className="text-[#ff004c] text-xs">(Default)</span>}</p>
                                <p className="text-xs opacity-60 mt-1">{addr.address}</p>
                                <p className="text-xs opacity-60">{addr.city}, {addr.state} - {addr.pincode}</p>
                                <p className="text-xs opacity-60">{addr.phone}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSavedAddress === addr.id ? 'border-[#ff004c] bg-[#ff004c]' : 'border-white/30'}`}>
                                {selectedSavedAddress === addr.id && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Address Button */}
                      <button
                        onClick={() => { setSelectedSavedAddress(null); setShippingInfo({ name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '' }); }}
                        className="w-full p-4 border border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-[#ff004c] transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">+</span> Add New Address
                      </button>

                      {/* Address Form */}
                      {(selectedSavedAddress === null || !savedAddresses.find(a => a.id === selectedSavedAddress)) && (
                        <div className="space-y-3 mt-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={shippingInfo.name}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                          />
                          <input
                            type="text"
                            placeholder="Address (House No., Street, Area)"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="City"
                              value={shippingInfo.city}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={shippingInfo.state}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Pin Code"
                              value={shippingInfo.pincode}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                            />
                          </div>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff004c] transition-all"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Order Summary</h3>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4 max-h-[300px] overflow-y-auto">
                        {checkoutItems.map((item) => (
                          <div key={item.cartId} className="flex items-center gap-4">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200'; }}
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-sm">{item.name}</h4>
                              <p className="text-[#ff004c] font-black text-sm">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="opacity-60">Subtotal</span>
                          <span className="font-bold">₹{checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="opacity-60">Shipping</span>
                          <span className="font-bold text-[#ff004c]">FREE</span>
                        </div>
                        <div className="flex justify-between text-lg font-black pt-4 border-t border-white/10">
                          <span>Total</span>
                          <span>₹{isCouponApplied ? Math.round(checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) * 0.8) : checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</span>
                        </div>
                      </div>

                      {/* Coupon Section - In Shipping Step */}
                      <div className="mt-6 lg:mt-8 mb-4 lg:mb-6 overflow-hidden bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-2xl lg:rounded-3xl relative group">
                        <div className="absolute top-0 right-0 p-4 lg:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <CheckCircle size={40} className="text-[#8b5cf6] lg:w-20 lg:h-20" />
                        </div>
                        <div className="p-4 lg:p-6 flex flex-col gap-3 lg:gap-4 relative z-10">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="p-2 lg:p-2.5 bg-[#8b5cf6] rounded-xl lg:rounded-xl shadow-[0_0_20px_-5px_#8b5cf6]">
                              <QrCode size={14} className="text-white lg:w-4 lg:h-4" />
                            </div>
                            <div>
                              <span className="text-sm lg:text-base font-black text-white block">Apply Coupon Code</span>
                              <span className="text-[8px] lg:text-[9px] font-bold text-[#8b5cf6] uppercase tracking-widest">Unlock exclusive savings</span>
                            </div>
                          </div>

                          <div className="flex gap-2 lg:gap-2 p-1 bg-black/40 rounded-xl lg:rounded-xl border border-white/5 backdrop-blur-md">
                            <input
                              type="text"
                              placeholder="Enter coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              className="flex-1 bg-transparent px-3 lg:px-4 py-2 text-xs lg:text-sm font-black outline-none placeholder:text-white/10 tracking-widest"
                            />
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
                                  const res = await couponApi.validate(couponCode, totalAmount);
                                  if (res.valid) {
                                    setIsCouponApplied(true);
                                    alert(`Coupon Applied! 20% discount added.`);
                                  } else {
                                    setIsCouponApplied(false);
                                    alert(res.message || 'Invalid coupon code.');
                                  }
                                } catch (err) {
                                  setIsCouponApplied(false);
                                  alert('Failed to validate coupon.');
                                }
                              }}
                              className="px-4 lg:px-6 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:-translate-y-0.5"
                            >
                              Apply
                            </button>
                          </div>

                          {isCouponApplied && (
                            <div className="flex items-center gap-2 text-[8px] lg:text-[9px] text-green-400 font-black uppercase tracking-widest bg-green-500/10 p-2 rounded-lg border border-green-500/20 animate-in zoom-in-95">
                              <CheckCircle size={10} className="lg:w-3 lg:h-3" /> SABBPE20 APPLIED - 20% OFF!
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          if (selectedSavedAddress === null && shippingInfo.name && shippingInfo.address) {
                            try {
                              const newAddress = {
                                name: shippingInfo.name,
                                phone: shippingInfo.phone,
                                addressLine1: shippingInfo.address,
                                city: shippingInfo.city,
                                state: shippingInfo.state,
                                pincode: shippingInfo.pincode,
                                addressType: 'Home'
                              };
                              const created: any = await addressApi.addAddress(newAddress);
                              const newId = created.addressId || created.id || Date.now().toString();
                              setSavedAddresses([...savedAddresses, {
                                id: newId,
                                ...newAddress,
                                isDefault: false
                              }]);
                              setSelectedSavedAddress(newId);
                            } catch (err) {
                              alert('Failed to add address. Please ensure you are logged in and details are valid.');
                              return;
                            }
                          }
                          (selectedSavedAddress || (shippingInfo.name && shippingInfo.address)) ? setCheckoutStep(2) : alert('Please fill all required fields');
                        }}
                        className="mt-6 w-full py-5 bg-[#ff004c] text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Review Order */}
                {checkoutStep === 2 && (
                  <div className="grid grid-cols-1 gap-8">
                    {/* Mobile: Order details first, then payment */}
                    <div className="space-y-6">
                      {/* Payment Header */}
                      <div className="mt-6 lg:mt-12 mb-6 lg:mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff004c] mb-2 opacity-80">Choose Payment Gateway</h3>
                        <div className="h-1 w-12 bg-gradient-to-r from-[#ff004c] to-transparent rounded-full"></div>
                      </div>

                      {/* Pay with SABBPE - Simple Button */}
                      <button
                        onClick={async () => {
                          setIsProcessingPayment(true)
                          await new Promise(resolve => setTimeout(resolve, 2000))

                          let finalOrderId = 'ORD-' + Date.now().toString().slice(-6);

                          try {
                            // If user bypassed address selection somehow, gracefully fail rather than pass invalid string triggering DB FK collapse
                            const chosenAddressId = selectedSavedAddress ? selectedSavedAddress.toString() : savedAddresses[0]?.id;
                            if (!chosenAddressId) throw new Error("Missing valid User Address ID");

                            let createdOrder;
                            if (instantBuyItem) {
                              createdOrder = await orderApi.instantBuy(
                                chosenAddressId,
                                instantBuyItem.variantId || instantBuyItem.id || 'default_variant',
                                instantBuyItem.quantity || 1,
                                instantBuyItem.price,
                                'SABBPE',
                                isCouponApplied ? couponCode : undefined
                              );
                            } else {
                              const itemsForBackend = checkoutItems.map((item: any) => {
                                return {
                                  variantId: item.variantId || item.id || 'default_variant',
                                  quantity: item.quantity || 1,
                                  price: item.price
                                };
                              });

                              createdOrder = await orderApi.create(
                                chosenAddressId,
                                'SABBPE',
                                itemsForBackend,
                                isCouponApplied ? couponCode : undefined
                              );
                            }

                            if (createdOrder && createdOrder.orderId) {
                              finalOrderId = createdOrder.orderId;
                            }
                          } catch (err) {
                            console.warn("Backend order creation failed, generating local fallback ID", err);
                          }

                          try {
                            // --- Sabbpe Payment Gateway Integration ---
                            const totalCost = isCouponApplied ? Math.round(checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) * 0.8) : checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
                            const productDesc = `Order ${finalOrderId}`;

                            const tknRes = await sabbpePaymentApi.getToken(finalOrderId);

                            const initRes = await sabbpePaymentApi.initiate(
                              totalCost,
                              productDesc,
                              {

                                "firstname": "Indumenti",
                                "email": "indumentitrading373@gmail.com",
                                "phone": "7605006518"

                              },
                              tknRes.sabbpe_token,
                              window.location.origin, // The domain format expected: e.g. http://localhost:5173
                              finalOrderId
                            );

                            if (initRes && initRes.payment_url) {
                              // Redirect user directly out of the React app into the Secure Gateway
                              window.location.href = initRes.payment_url;
                              return; // Halt script explicitly
                            } else {
                              alert('Failure retrieving payment URL from Gateway.');
                            }
                          } catch (e) {
                            console.error("Payment Gateway Error", e);
                            alert('Failed to connect to Sabbpe Payment Subsystem.');
                          }

                          setIsProcessingPayment(false);
                        }}
                        disabled={isProcessingPayment || checkoutItems.length === 0}
                        className="w-full py-6 bg-gradient-to-r from-[#0052FF] to-[#00a8ff] text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                      >
                        {isProcessingPayment ? 'Processing...' : `Pay ₹${isCouponApplied ? Math.round(checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) * 0.8) : checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)} with SabbPe`}
                      </button>

                      {/* Back Button */}
                      <button onClick={() => setCheckoutStep(1)} className="w-full py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                        Back
                      </button>


                      {/* Safe & Secure Card */}
                      <div className="rounded-2xl lg:rounded-[32px] bg-white/5 border border-white/10 p-4 lg:p-6 flex items-center justify-between group hover:border-green-500/30 transition-all">
                        <div className="flex items-center gap-3 lg:gap-5">
                          <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-all text-green-500">
                            <Shield size={20} />
                          </div>
                          <div>
                            <h5 className="text-white font-black text-xs lg:text-sm uppercase tracking-widest">Safe & Secure</h5>
                            <p className="text-[8px] lg:text-[10px] text-white/40 font-bold uppercase tracking-tight mt-0.5">256-bit SSL Encryption</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 lg:gap-3">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/UPI_Logo_%28vector%29.svg/1200px-UPI_Logo_%28vector%29.svg.png" className="h-2 lg:h-2.5 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="UPI" />
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {checkoutStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Shipping Address</h3>
                      <p className="font-bold">{shippingInfo.name}</p>
                      <p className="text-sm opacity-60">{shippingInfo.address}</p>
                      <p className="text-sm opacity-60">{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                      <p className="text-sm opacity-60">{shippingInfo.phone} | {shippingInfo.email}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Payment Method</h3>
                      <p className="font-bold">{selectedPaymentOption === 'sabbpe_card' ? 'Credit / Debit Card' : selectedPaymentOption === 'sabbpe_upi' ? 'UPI / Apps' : selectedPaymentOption === 'sabbpe_netbanking' ? 'Net Banking' : selectedPaymentOption === 'sabbpe_wallet' ? 'Wallets' : selectedPaymentOption === 'sabbpe_cod' ? 'Cash on Delivery' : 'Not Selected'}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {checkoutItems.map((item) => (
                          <div key={item.cartId} className="flex items-center gap-4">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200'; }}
                            />
                            <div className="flex-1">
                              <h4 className="font-bold">{item.name}</h4>
                              <p className="text-xs opacity-60">{item.category}</p>
                            </div>
                            <p className="text-[#ff004c] font-black">₹{item.price}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                        <div className="flex justify-between">
                          <span className="opacity-60">Subtotal</span>
                          <span className="font-bold">₹{checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">Shipping</span>
                          <span className="font-bold text-[#ff004c]">FREE</span>
                        </div>
                        <div className="flex justify-between text-xl font-black pt-2">
                          <span>Total</span>
                          <span>₹{checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setCheckoutStep(2)} className="flex-1 py-5 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                        Back
                      </button>
                      <button
                        onClick={() => {
                          const newOrder = {
                            id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
                            date: new Date().toISOString().split('T')[0],
                            status: selectedPaymentOption === 'sabbpe_cod' ? 'Processing' : 'Processing',
                            items: checkoutItems.map(item => ({ name: item.name, price: item.price, image: item.images?.[0] || item.image, color: item.color, colorHex: item.colorHex, qty: item.quantity || 1 })),
                            total: checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
                            shippingAddress: { name: shippingInfo.name, address: shippingInfo.address, city: shippingInfo.city, state: shippingInfo.state || 'Maharashtra', pincode: shippingInfo.pincode, phone: shippingInfo.phone },
                            payment: selectedPaymentOption === 'sabbpe_card' ? 'Credit/Debit Card' : selectedPaymentOption === 'sabbpe_upi' ? 'UPI' : selectedPaymentOption === 'sabbpe_netbanking' ? 'Net Banking' : selectedPaymentOption === 'sabbpe_wallet' ? 'Wallets' : selectedPaymentOption === 'sabbpe_cod' ? 'Cash on Delivery' : 'Not Selected',
                            trackingNumber: null,
                            carrier: 'Pending',
                            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            actualDelivery: null,
                            timeline: [
                              { status: 'Order Placed', date: new Date().toISOString().replace('T', ' ').substring(0, 16), completed: true },
                              { status: 'Payment Confirmed', date: selectedPaymentOption === 'sabbpe_cod' ? null : new Date().toISOString().replace('T', ' ').substring(0, 16), completed: selectedPaymentOption !== 'sabbpe_cod' },
                              { status: 'Processing', date: null, completed: false },
                              { status: 'Shipped', date: null, completed: false },
                              { status: 'Delivered', date: null, completed: false }
                            ]
                          };
                          setOrders([newOrder, ...orders]);
                          setCart([]);
                          setCheckoutOpen(false); setInstantBuyItem(null);
                          setCheckoutStep(1);
                          setShippingInfo({ name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '' });
                          setSelectedPaymentOption('');
                          setProfileSection('orders');
                          setProfileOpen(true);
                        }}
                        className="flex-1 py-5 bg-[#ff004c] text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all"
                      >
                        Place Order ₹{checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* UPI QR Scanner Modal */}
      <AnimatePresence>
        {upiScannerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setUpiScannerOpen(false)} className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[100] bg-[#08080c] rounded-3xl border border-white/10 overflow-hidden"
            >
              <div className="p-8 text-center">
                <button onClick={() => setUpiScannerOpen(false)} className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100 hover:text-[#ff004c] transition-all">
                  <X size={24} />
                </button>

                <div className="w-24 h-24 bg-[#ff004c] rounded-full flex items-center justify-center mx-auto mb-6">
                  <QrCode size={48} className="text-white" />
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Scan to Pay</h2>
                <p className="text-sm opacity-60 mb-6">Scan via any UPI app or Net Banking</p>

                {/* QR Code Display */}
                <div className="bg-white p-4 rounded-2xl mb-6 inline-block">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI://sabbpe@bank?amount={checkoutItems.reduce((sum%2C%20item)%20=%3E%20sum%20+%20item.price%2C%200)}&pa=sabbpe@upi&pn=SABBPE"
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-6">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Pay to UPI ID</p>
                  <p className="font-mono text-lg font-bold text-[#ff004c]">sabbpe@upi</p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Order Amount</span>
                    <span className="font-black">₹{checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">UPI App</span>
                    <span className="font-bold">Google Pay, PhonePe, Paytm</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setUpiScannerOpen(false); setCheckoutStep(3); }}
                    className="flex-1 py-4 bg-white/10 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
                  >
                    I've Paid
                  </button>
                  <button
                    onClick={() => setUpiScannerOpen(false)}
                    className="flex-1 py-4 bg-[#ff004c] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-[10px] opacity-40 mt-4">
                  Secure payment powered by UPI. By scanning you agree to terms.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
