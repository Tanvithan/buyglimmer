import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authApi } from '../services/authApi'
import { 
  Mail, Lock, Loader2
} from 'lucide-react'

interface LoginProps {
  onLogin?: (user?: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }
    setError('')
    setLoading(true)
    
    try {
      const response = await authApi.login(email, password)
      
      const userObj = response.user
      if (userObj) {
        if (onLogin) onLogin(userObj)
      } else {
        throw new Error('User data missing')
      }
      
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
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
        {/* Brand Link */}
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-black tracking-tighter">
            SABBPE<span className="text-[#ff004c]">.</span>
          </Link>
        </div>

        {/* Professional Card */}
        <div className="glass-premium rounded-[32px] p-8 border border-white/5 bg-white/[0.02]">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Login</h2>
              <p className="text-white/40 text-sm mt-1">Welcome back. Enter your credentials to access your account.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-[#ff004c]/50 transition-all">
                  <Mail size={18} className="text-white/20" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="name@company.com"
                    className="bg-transparent py-4 px-3 w-full outline-none font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                  <a href="#" className="text-[10px] font-bold text-[#ff004c] hover:underline uppercase tracking-wide">Forgot?</a>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-[#ff004c]/50 transition-all">
                  <Lock size={18} className="text-white/20" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="••••••••"
                    className="bg-transparent py-4 px-3 w-full outline-none font-bold text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              {error && (
                <p className="text-[#ff004c] text-xs font-bold leading-none">{error}</p>
              )}

              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full h-14 bg-[#ff004c] hover:bg-[#ff004c]/90 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login</>}
              </button>
            </div>

            <div className="pt-2 text-center">
              <p className="text-white/40 text-xs font-bold">
                New here?{' '}
                <Link to="/register" className="text-[#ff004c] hover:underline">Create account</Link>
              </p>
            </div>
          </div>
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
