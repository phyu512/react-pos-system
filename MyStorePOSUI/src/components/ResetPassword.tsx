import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { PATHS } from '../paths';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ 
        email, 
        token: token ? token.replace(/ /g, '+') : "", 
        newPassword: password,
        confirmPassword: confirmPassword 
      });

      setSuccess(true);
      setTimeout(() => navigate(PATHS.LOGIN), 3000);
    } catch (err: any) {
      const backendError = err.response?.data?.message || 
                           (Array.isArray(err.response?.data) ? err.response?.data[0]?.description : null) ||
                           'Failed to reset password.';
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-[440px] w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-white relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            {success ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">
            {success ? "Success!" : "Reset Password"}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {success 
              ? "Your password has been updated successfully." 
              : "Enter your account email and a new secure password."}
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-4 rounded-2xl flex flex-col items-center animate-in fade-in zoom-in">
            <p className="text-sm font-medium text-center">Redirecting you to login...</p>
            <Loader2 className="animate-spin mt-3 text-green-500" size={20} />
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="mr-2 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-[0.1em]">Email Address</label>
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

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-[0.1em]">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {/* Reversed Logic: EyeOff when hidden, Eye when visible */}
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-[0.1em]">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {/* Reversed Logic: EyeOff when hidden, Eye when visible */}
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:bg-slate-300 group mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <Link to={PATHS.LOGIN} className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;