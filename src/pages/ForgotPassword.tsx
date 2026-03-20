import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mail, Lock, Loader2
} from 'lucide-react'
import { authApi } from '../services/authApi'

type ForgotPasswordStep = 'email' | 'success'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ForgotPasswordStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleResetPassword = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    
    try {
      await authApi.resetPassword(email, password)
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.')
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
          {step === 'email' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
                <p className="text-white/40 text-sm mt-1">Enter your email and new password.</p>
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">New Password</label>
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
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Confirm Password</label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-[#ff004c]/50 transition-all">
                    <Lock size={18} className="text-white/20" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setError('')
                      }}
                      placeholder="••••••••"
                      className="bg-transparent py-4 px-3 w-full outline-none font-bold text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-[#ff004c] text-xs font-bold leading-none">{error}</p>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full h-14 bg-[#ff004c] hover:bg-[#ff004c]/90 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Reset Password</>}
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-white/40 text-xs font-bold">
                  Remember your password?{' '}
                  <Link to="/login" className="text-[#ff004c] hover:underline">Login</Link>
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-8 space-y-6"
            >
              <div className="w-20 h-20 bg-[#ff004c]/10 rounded-full flex items-center justify-center mx-auto border border-[#ff004c]/20">
                <Lock className="text-[#ff004c]" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Password Reset</h2>
                <p className="text-white/40 text-sm mt-1">Your password has been reset successfully.</p>
              </div>
              <button 
                onClick={() => navigate('/login')} 
                className="w-full h-14 bg-[#ff004c] hover:bg-[#ff004c]/90 text-white rounded-2xl font-bold transition-all"
              >
                Go to Login
              </button>
            </motion.div>
          )}
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
