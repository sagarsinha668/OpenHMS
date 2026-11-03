import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LogIn, Activity, Lock, Mail, Loader2, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success('Viewer credentials filled! Click "Sign In" to explore.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome to Ayurvishwa Healthcare!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden py-8">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md px-4 z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">OpenHMS</h1>
          <p className="text-slate-500 mt-1 font-medium">Healthcare Management System</p>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-bold">Sign In</CardTitle>
            <CardDescription className="text-center text-xs">
              Please enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
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
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
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
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
            </CardFooter>
          </form>
        </Card>

        {/* Client Demo Access Card */}
        <div className="mt-5 p-4 bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-blue-50/90 rounded-2xl border border-indigo-100/80 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                Demo Explorer Account
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Read-Only
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Clients can explore all 4 dashboards (<strong>Admin</strong>, <strong>Doctor</strong>, <strong>Receptionist</strong>, and <strong>Pharmacist</strong>) with live records:
          </p>

          <div className="bg-white/80 backdrop-blur-xs rounded-xl p-2.5 border border-indigo-100/60 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-medium">Email:</span>
              <code className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                viewer@gmail.com
              </code>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-medium">Password:</span>
              <code className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                viewer@123
              </code>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFillDemo('viewer@gmail.com', 'viewer@123')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-100/80 hover:bg-indigo-200/80 active:bg-indigo-300/80 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-fill Viewer Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
