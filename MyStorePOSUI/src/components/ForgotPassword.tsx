import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { PATHS } from '../paths';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calling the service method we added earlier
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Could not process request. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration to match Login */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-[440px] w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-white relative z-10">
        
        <Link to={PATHS.LOGIN} className="inline-flex items-center text-slate-400 hover:text-blue-600 text-xs font-bold uppercase tracking-wider mb-8 transition-colors group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {!submitted ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">Forgot Password?</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:bg-slate-300 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-500">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">Check your email</h2>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed px-4">
              We've sent a recovery link to <br/>
              <span className="font-bold text-slate-900">{email}</span>
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-8 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors underline"
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;