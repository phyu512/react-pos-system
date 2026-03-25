import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Added Eye and EyeOff
import { Lock, Mail, Loader2, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react'; 
import { authService } from '../services/authService';
import { PATHS } from '../paths';

interface LoginResponse {
  token: string;
  role: string;
  permissions: string[];
  expiration: string;
  user: {
    email: string;
    fullName: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // 1. New State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(PATHS.DASHBOARD, { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password }) as LoginResponse;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.user.email,
        role: response.role,
        permissions: response.permissions
      }));
      navigate(PATHS.DASHBOARD);
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-[440px] w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-white relative z-10">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0">
                <span className="text-orange-500 text-2xl">★</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-[900] text-slate-900 leading-none tracking-tighter">STAR LINK</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-1">Trading System</span>
            </div>
          </div>
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-4"></div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-8 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} // 2. Dynamic Type
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* 3. Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-between items-center ml-1">
              <Link 
                to={PATHS.ResetPassword}
                className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:bg-slate-300 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* REGISTER SECTION */}
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link 
              to={PATHS.Register}
              className="text-blue-600 font-bold hover:text-blue-700 inline-flex items-center group transition-colors"
            >
              Sign Up
              <UserPlus size={14} className="ml-1 group-hover:scale-110 transition-transform" />
            </Link>
          </p>
        </div>

        <p className="mt-10 text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">
          &copy; 2026 Star Link Trading
        </p>
      </div>
    </div>
  );
};

export default Login;