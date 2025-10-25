import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Force dark theme on component mount and add mouse tracking
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.body.classList.add('dark')
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Mock credentials for testing
      const mockCredentials = {
        email: 'admin@test.com',
        password: '12345678'
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Check mock credentials
      if (email !== mockCredentials.email || password !== mockCredentials.password) {
        throw new Error('Invalid credentials. Use: admin@test.com / 12345678')
      }

      // Generate mock token
      const mockToken = 'mock_jwt_token_' + Date.now()

      if (rememberMe) {
        localStorage.setItem('auth_token', mockToken)
      } else {
        sessionStorage.setItem('auth_token', mockToken)
      }

      navigate('/app/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.03}px`,
            bottom: `${mousePosition.y * 0.03}px`,
            transform: 'translate(50%, 50%)'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.08}px`,
            bottom: `${mousePosition.y * 0.08}px`,
            transform: 'translate(-30%, 30%)'
          }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center text-white font-semibold">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-3">
                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
                    {error}
                  </div>
                )}
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-emerald-300 text-sm font-medium flex items-center gap-2">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 bg-white/5 border border-emerald-500/30 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl transition-all duration-300 hover:border-emerald-400/50 hover:bg-white/10"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-emerald-300 text-sm font-medium flex items-center gap-2">
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 bg-white/5 border border-emerald-500/30 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl transition-all duration-300 hover:border-emerald-400/50 hover:bg-white/10"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-emerald-400 hover:text-cyan-400 transition-colors" />
                      ) : (
                        <Eye className="w-4 h-4 text-emerald-400 hover:text-cyan-400 transition-colors" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="border-emerald-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-cyan-500 data-[state=checked]:border-emerald-500 rounded-md"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-emerald-300 cursor-pointer hover:text-cyan-300 transition-colors"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-cyan-400 hover:text-cyan-300 p-0 h-auto font-medium transition-colors"
                  >
                    Forgot password?
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:via-cyan-400 hover:to-blue-400 text-white font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 rounded-xl transform hover:scale-[1.02] hover:shadow-3xl relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isLoading ? (
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 relative z-10">
                      <Zap className="w-5 h-5" />
                      <span>Sign In</span>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-emerald-400 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border border-red-500/30 hover:border-red-400 bg-white/5 hover:bg-red-500/10 text-red-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border border-gray-500/30 hover:border-gray-400 bg-white/5 hover:bg-gray-500/10 text-gray-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-400 pt-2">
                  Don't have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-bold transition-colors"
                  >
                    Sign up for free
                  </Button>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
