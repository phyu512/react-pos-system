import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, Mail, Loader2, ArrowRight, User, CheckCircle2,
  ShieldCheck, Eye, EyeOff 
} from 'lucide-react';
import { authService } from '../services/authService';
import { PATHS } from '../paths';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false); // NEW: Success state
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // 1. Await the service call
      const response =await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      // 2. If we reached here, axios considers it a 2xx success
      console.log("Registration Success:", response);
      
      setSuccess(true); // Trigger the green checkmark UI

      // 3. Delay then redirect
      setTimeout(() => {
        navigate(PATHS.LOGIN || '/login', { 
          state: { successMessage: 'Account created! Please sign in.' } 
        });
      }, 2000);

    } catch (err: any) {
        const errorData = err.response?.data;
        if (Array.isArray(errorData)) {
          const fullMessage = errorData.map(e => e.description).join(" ");
          setError(fullMessage);
        } else if (errorData?.errors) {
          const modelErrors = Object.values(errorData.errors).flat().join(" ");
          setError(modelErrors);
        } else {
          setError(errorData?.message || "An unexpected error occurred.");
        }
        setLoading(false);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-[480px] w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-white relative z-10 text-center">
        
        {/* SUCCESS VIEW */}
        {success ? (
          <div className="py-10 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-[900] text-slate-900 mb-2">Registration Successful!</h2>
            <p className="text-slate-500 mb-6 font-medium">Redirecting you to the login page...</p>
            <Loader2 className="animate-spin mx-auto text-blue-600" size={24} />
          </div>
        ) : (
          <>
            {/* LOGO SECTION */}
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0">
                    <span className="text-orange-500 text-2xl">★</span>
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-2xl font-[900] text-slate-900 leading-none tracking-tighter">STAR LINK</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-1">Join the Network</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium mt-2">Create your trading account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-left font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5 text-left">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    name="fullName"
                    type="text" 
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {/* If showPassword is TRUE (text is visible), show EyeOff (click to hide).
                        If showPassword is FALSE (text is stars), show Eye (click to reveal).
                    */}
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Confirm Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:bg-slate-300 group mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{' '}
                <Link 
                  to={PATHS.LOGIN || "/login"} 
                  className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          &copy; 2026 Star Link Trading
        </p>
      </div>
    </div>
  );
};

export default Register;