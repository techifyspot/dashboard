import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RainingLetters from '@/components/ui/modern-animated-hero-section';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Clear form state when component mounts if not signed in
  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      // Reset form state for fresh login attempt
      setEmail('');
      setPassword('');
      setErrors({});
    }
  }, [isSignedIn, isLoaded]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isLoaded) {
      toast.error('Authentication not ready', { description: 'Please wait a moment and try again' });
      return;
    }
    
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Create sign-in attempt
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        // Set the active session
        await setActive({ session: result.createdSessionId });
        
        // Clear form state
        setEmail('');
        setPassword('');
        setErrors({});
        
        toast.success('Welcome back!', { description: 'Redirecting to dashboard...' });
        
        // Small delay to ensure session is set before navigation
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        // Handle incomplete sign-in (e.g., MFA required)
        toast.error('Sign in incomplete', { description: 'Please complete all authentication steps' });
        setErrors({ password: 'Sign in incomplete. Please check your credentials.' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.errors?.[0]?.message || 'Invalid email or password';
      toast.error('Sign in failed', { description: errorMessage });
      setErrors({ password: errorMessage });
      
      // Clear password field on error
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <RainingLetters phrases={['Welcome Back', 'Sign In', 'TechifySpot', 'AI Workspace']} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Logo Only */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex flex-col items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img 
                src="/Logo.png" 
                alt="Logo" 
                className="h-50 w-auto object-contain mx-auto"
              />
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="glass-panel p-6 md:p-8 lg:p-10">
              {/* Mobile Header */}
              <div className="md:hidden text-center mb-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <img 
                    src="/Logo.png" 
                    alt="TechifySpot Logo" 
                    className="h-20 w-auto object-contain mx-auto mb-4"
                  />
                </motion.div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to continue</p>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Sign In</h2>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`pl-12 h-12 ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm mt-1.5"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`pl-12 pr-12 h-12 ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm mt-1.5"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading || !isLoaded}
                  className="w-full h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Sign up link */}
              <p className="text-center mt-6 text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
