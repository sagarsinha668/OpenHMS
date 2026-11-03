import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  LogIn, 
  Activity, 
  Lock, 
  Mail, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Building2,
  Package
} from 'lucide-react';
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
    toast.success('Viewer credentials auto-filled! Click "Sign In" to proceed.', {
      icon: '✨',
    });
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/80 relative overflow-hidden px-4 py-8">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-4xl z-10 animate-in fade-in zoom-in duration-500">
        {/* Top Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 mb-3 transform hover:rotate-6 transition-transform duration-300">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">OpenHMS</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Healthcare Management System</p>
        </div>

        {/* Side-by-Side Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Left Column: Sign In Form Card */}
          <Card className="border border-slate-200/80 shadow-xl shadow-slate-200/60 backdrop-blur-sm bg-white/95 flex flex-col justify-between">
            <div>
              <CardHeader className="space-y-1 pb-3">
                <CardTitle className="text-xl font-bold text-slate-900">Sign In</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit} id="login-form">
                <CardContent className="space-y-3.5 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@hospital.com" 
                        className="pl-9 h-10 text-sm border-slate-200 focus:border-primary transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot?</a>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="password" 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        className="pl-9 pr-10 h-10 text-sm border-slate-200 focus:border-primary transition-all font-mono"
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
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </form>
            </div>

            <CardFooter className="pt-2 pb-5 flex flex-col gap-2">
              <Button 
                type="submit" 
                form="login-form"
                className="w-full h-10 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                Secure access with role-based routing
              </p>
            </CardFooter>
          </Card>

          {/* Right Column: Client / Viewer Demo Access Card */}
          <div className="rounded-xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white/90 p-5 shadow-xl shadow-indigo-100/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-950 leading-tight">Demo Access</h3>
                    <p className="text-[11px] text-indigo-600 font-medium">For Clients & Evaluators</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Read-Only Mode
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Explore all 4 system dashboards with full pre-loaded clinical and operational data:
              </p>

              {/* Roles pills */}
              <div className="grid grid-cols-2 gap-2 mb-3.5">
                <div className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-lg border border-indigo-100 text-slate-700 text-xs">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">Admin</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-lg border border-indigo-100 text-slate-700 text-xs">
                  <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
                  <span className="font-semibold">Doctor</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-lg border border-indigo-100 text-slate-700 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-semibold">Receptionist</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-lg border border-indigo-100 text-slate-700 text-xs">
                  <Package className="h-3.5 w-3.5 text-amber-600" />
                  <span className="font-semibold">Pharmacist</span>
                </div>
              </div>

              {/* Credentials Box */}
              <div className="bg-white rounded-lg p-2.5 border border-indigo-100 space-y-1.5 text-xs shadow-2xs mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <code className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    viewer@gmail.com
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Password:</span>
                  <code className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    viewer@123
                  </code>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => handleFillDemo('viewer@gmail.com', 'viewer@123')}
              variant="outline"
              className="w-full h-10 border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Auto-fill Viewer Credentials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
