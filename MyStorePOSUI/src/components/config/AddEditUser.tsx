import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Check, Store, Eye, EyeOff, Loader2 } from 'lucide-react';
import { PATHS } from '../../paths';
import { userService } from '../../services/userService';
import { DEFAULT_USER_PASSWORD } from '../../constants/auth';

const AddEditUser: React.FC = () => {
  // 1. Get ID from the dynamic route: .../edit/:id
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [roles, setRoles] = useState<any[]>([]);
  const [outlets, setOutlets] = useState<any[]>([]);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Add this line with your other state declarations
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | string[] | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    staffPin: '',
    outletIds: [] as string[]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [roleRes, outletRes] = await Promise.all([
          userService.fetchRoles(),
          userService.fetchOutlets()
        ]);
        
        const rolesData = roleRes.data || roleRes || [];
        const outletsData = outletRes.data || outletRes || [];

        setRoles(rolesData);
        setOutlets(outletsData);

        // 2. If ID exists, we are in Edit Mode - Fetch User Details
        if (isEditMode && id) {
          const user = await userService.getUserById(id);
          
          const assignedIds = Array.isArray(user.outletIds) 
            ? user.outletIds.map((val: any) => String(val)) 
            : [];

          setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            password: '', // Leave empty so admin only fills it to CHANGE it
            role: user.role || '',
            staffPin: user.staffPin || '',
            outletIds: assignedIds 
          });
        }
      } catch (error) {
        console.error("Error loading component data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditMode]);

  const handleOutletToggle = (outletId: string | number) => {
    const idStr = String(outletId);
    setFormData(prev => {
      const isSelected = prev.outletIds.includes(idStr);
      const newIds = isSelected
        ? prev.outletIds.filter(i => i !== idStr)
        : [...prev.outletIds, idStr];
      return { ...prev, outletIds: newIds };
    });
  };
  const handleResetPassword = () => {
    const confirmReset = window.confirm("Are you sure you want to reset default password?");
    if (confirmReset) {
      setFormData(prev => ({ ...prev, password: DEFAULT_USER_PASSWORD }));
      alert("Password set to default. Click 'Update User' to save changes.");
    }
  };
  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null); // Clear previous errors

    try {
      if (isEditMode && id) {
        const { password, ...updateData } = formData;
        const finalPayload = password.trim() !== '' 
          ? { ...updateData, password } 
          : updateData;

        await userService.update(id, finalPayload);
      } else {
        await userService.create(formData);
      }
      navigate(PATHS.UserList);
    } catch (err: any) {
      // 1. Extract error details from API
      const apiError = err.response?.data;
      
      if (Array.isArray(apiError)) {
        // If .NET Identity returns an array of error objects: [{code: "", description: ""}]
        setError(apiError.map((e: any) => e.description || e.message));
      } else if (apiError?.errors) {
        // If it's a validation dictionary (ModelState)
        const messages = Object.values(apiError.errors).flat() as string[];
        setError(messages);
      } else {
        // Fallback to general message
        setError(apiError?.message || "An unexpected error occurred.");
      }
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="text-slate-500 font-medium tracking-wide">Fetching user record...</p>
    </div>
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <Link to={PATHS.UserList} className="flex items-center text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Directory
        </Link>
      </div>
      {/* Header section... */}
      {/* Detailed Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800">Submission Failed</h3>
              <div className="mt-1 text-sm text-red-700">
                {Array.isArray(error) ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {error.map((msg, idx) => <li key={idx}>{msg}</li>)}
                  </ul>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto pl-3 text-red-500 hover:text-red-700 transition-colors"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">  
        {/* Profile Section */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">User Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input 
                type="text" required value={formData.fullName} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" required disabled={isEditMode} value={formData.email} 
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${isEditMode ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'}`} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Security Section */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Security & POS Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">System Role</label>
              <select 
                required
                value={formData.role} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="">Select a role...</option>
                {roles.map((r: any) => (
                  <option key={r.id || r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Staff PIN (6 digits)</label>
              <div className="relative">
                <input 
                  type={showPin ? "text" : "password"} maxLength={6} required={!isEditMode} value={formData.staffPin} 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10 font-mono tracking-widest" 
                  onChange={(e) => setFormData({...formData, staffPin: e.target.value.replace(/\D/g, '')})} 
                />
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">System Password</label>
              
              {isEditMode ? (
                /* --- EDIT MODE: RESET ACTION --- */
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className={`w-full py-2.5 px-4 rounded-lg border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    formData.password === DEFAULT_USER_PASSWORD
                      ? 'bg-green-50 border-green-200 text-green-600 cursor-default' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {formData.password === DEFAULT_USER_PASSWORD ? (
                    <><Check size={14} /> Password set to Default</>
                  ) : (
                    'Reset to Default Password'
                  )}
                </button>
              ) : (
                /* --- ADD MODE: HYBRID INPUT --- */
                <div className="relative flex items-center group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={formData.password}
                    placeholder="Enter custom or use default"
                    /* pr-36 leaves room for the Eye and the Default button */
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-36 transition-all font-mono text-sm" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  
                  <div className="absolute right-2 flex items-center gap-2">
                    {/* Toggle Visibility */}
                    <button 
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? "Hide Password" : "Show Password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>

                    {/* Quick Set Default Button */}
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, password: DEFAULT_USER_PASSWORD})}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      USE DEFAULT
                    </button>
                  </div>
                </div>
              )}

              {/* Visual Hint for Admin */}
              {!isEditMode && (
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] text-slate-400 italic">
                    System default: <span className="font-semibold select-all cursor-pointer">{DEFAULT_USER_PASSWORD}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Outlet Assignment Section */}
        <div className="p-6 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Authorized Outlets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {outlets.map((o) => {
              const isActive = formData.outletIds.includes(String(o.outletId));
              return (
                <button 
                  key={o.outletId} 
                  type="button"
                  onClick={() => handleOutletToggle(o.outletId)} 
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left ${isActive ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'} `}><Store size={18} /></div>
                    <div>
                      <p className={`text-sm font-bold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>{o.outletName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{o.shortLocation}</p>
                    </div>
                  </div>
                  {isActive && <div className="bg-blue-600 rounded-full p-1 text-white shadow-sm"><Check size={14} /></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-200 gap-3">
          <button 
            type="button" 
            onClick={() => navigate(PATHS.UserList)} 
            className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="px-8 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-blue-700 transition-all flex items-center disabled:bg-slate-300 shadow-md active:scale-95"
          >
            {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
            {isEditMode ? 'Update Account' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditUser;