import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authApi } from '../services/authApi'
import { 
  Phone, Mail, CheckCircle, Loader2, User, Lock
} from 'lucide-react'

type RegisterStep = 'details' | 'success'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState<RegisterStep>('details')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleRegister = async () => {
    if (!formData.name || !formData.email || formData.phone.length !== 10 || !formData.password) {
      setError('Please fill in all details correctly.')
      return
    }
    setError('')
    setLoading(true)
    
    try {
      await authApi.register(formData.name, formData.email, formData.phone, formData.password)
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508] text-white flex items-center justify-center p-6">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#ff004c]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1a1a2e]/20 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-black tracking-tighter">
            SABBPE<span className="text-[#ff004c]">.</span>
          </Link>
        </div>

        <div className="glass-premium rounded-[32px] p-8 border border-white/5 bg-white/[0.02]">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div key="details" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
                  <p className="text-white/40 text-sm mt-1">Join our exclusive community.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-[#ff004c]/50 transition-all">
                      <User size={18} className="text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Name"
                        className="bg-transparent py-4 px-3 w-full outline-none font-bold text-sm"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-[#ff004c]/50 transition-all">
                      <Mail size={18} className="text-white/20" />
                      <input 
                        type="email" 
                        placeholder="Email"
                        className="bg-transparent py-4 px-3 w-full outline-none font-bold text-sm"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-[#ff004c]/50 transition-all">
                      <Phone size={18} className="text-white/20" />
                      <input 
                        type="tel" 
                        placeholder="10-digit number"
                        className="bg-transparent py-4 px-3 w-full outline-none font-bold text-sm"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-[#ff004c]/50 transition-all">
                      <Lock size={18} className="text-white/20" />
                      <input 
                        type="password" 
                        placeholder="Create a password"
                        className="bg-transparent py-4 px-3 w-full outline-none font-bold text-sm"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-[#ff004c] text-xs font-bold leading-none">{error}</p>}

                <button 
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full h-14 bg-[#ff004c] hover:bg-[#ff004c]/90 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Join Now</>}
                </button>

                <div className="pt-2 text-center">
                  <p className="text-white/40 text-xs font-bold">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#ff004c] hover:underline">Login</Link>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-6">
                <div className="w-20 h-20 bg-[#ff004c]/10 rounded-full flex items-center justify-center mx-auto border border-[#ff004c]/20">
                  <CheckCircle className="text-[#ff004c]" size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome</h2>
                  <p className="text-white/40 text-sm mt-1">Your account is ready.</p>
                </div>
                <button onClick={() => navigate('/login')} className="w-full h-14 bg-[#ff004c] hover:bg-[#ff004c]/90 text-white rounded-2xl font-bold transition-all">
                  Go to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-white/20 hover:text-white/60 transition-all text-[10px] font-black uppercase tracking-[0.2em]">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
