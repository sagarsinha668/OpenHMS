import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LogIn, Activity, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back to Ayurvishwa Healthcare!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md px-4 z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">OpenHMS</h1>
          <p className="text-slate-500 mt-2 font-medium">Healthcare Management System</p>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">Sign In</CardTitle>
            <CardDescription className="text-center">
              Please enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@hospital.com" 
                    className="pl-10 h-11 border-slate-200 focus:border-primary transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 border-slate-200 focus:border-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 z-10 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
              <div className="text-center text-sm text-slate-500">
                Authorized access only. By signing in, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a>.
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Guest/Demo Info */}
        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-center space-y-1">
          <p className="text-xs text-primary font-medium">
            Login: <span className="font-bold px-1.5 py-0.5 bg-white rounded shadow-xs">admin@gmail.com</span> | <span className="font-bold px-1.5 py-0.5 bg-white rounded shadow-xs">viewer@gmail.com</span>
          </p>
          <p className="text-xs text-primary/80">
            Password: <span className="font-bold px-1.5 py-0.5 bg-white rounded shadow-xs">shivsagar@9911</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
