import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Phone, ArrowLeft, ArrowRight, CheckCircle, 
  AlertCircle, Clock, Loader2, Mail 
} from 'lucide-react'

type ForgotPasswordStep = 'phone' | 'otp' | 'success'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ForgotPasswordStep>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [error, setError] = useState('')
  const [method, setMethod] = useState<'phone' | 'email'>('phone')

  const handleSendOtp = async () => {
    if (method === 'phone' && phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    if (method === 'email' && (!email.trim() || !email.includes('@'))) {
      setError('Please enter a valid email address')
      return
    }
    setError('')
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(false)
    setStep('otp')
    
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!value || !/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 2}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }
    setError('')
    setLoading(true)
    
    // Simulate API call - accept any 6-digit OTP for demo
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(false)
    setStep('success')
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setResendTimer(30)
    
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md px-4 sm:px-0"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            NEXUS<span className="text-cyan-400">WEAR</span>
          </h1>
          <p className="text-slate-400 mt-2">Reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50">
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Reset Password
                </h2>
                <p className="text-slate-400 mb-6">
                  Select a method to verify your identity and reset your password.
                </p>

                {/* Method Selection */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setMethod('phone')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      method === 'phone' 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                      : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Phone size={18} />
                    Phone OTP
                  </button>
                  <button
                    onClick={() => setMethod('email')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      method === 'email' 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                      : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Mail size={18} />
                    Email OTP
                  </button>
                </div>

                <div className="space-y-4">
                  {method === 'phone' ? (
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                            setPhone(val)
                            setError('')
                          }}
                          placeholder="Enter 10-digit number"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          placeholder="Enter your email"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-slate-400">
                    Remember your password?{' '}
                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                      Login
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => {
                    setStep('phone')
                    setOtp(['', '', '', '', '', ''])
                  }}
                  className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change {method === 'phone' ? 'phone number' : 'email'}
                </button>

                <h2 className="text-2xl font-semibold text-white mb-2">
                  Enter OTP
                </h2>
                <p className="text-slate-400 mb-6">
                  We've sent a 6-digit OTP to your {method === 'phone' ? 'phone number' : 'email address'}{' '}
                  <span className="text-cyan-400">
                    {method === 'phone' ? `+91 ${phone}` : email}
                  </span>
                </p>

                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 bg-slate-700/50 border border-slate-600 rounded-xl text-center text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    ))}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm justify-center"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Verify OTP
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>Resend OTP in {resendTimer}s</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-semibold text-white mb-2">
                  Identity Verified!
                </h2>
                <p className="text-slate-400 mb-8">
                  Your identity has been verified. You can now login to your account.
                </p>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all duration-300"
                >
                  Go to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
