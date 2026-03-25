import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Check, Store, Eye, EyeOff, Loader2 } from 'lucide-react';
import { PATHS } from '../../paths';
import { userService } from '../../services/userService';

const AddEditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [roles, setRoles] = useState<any[]>([]);
  const [outlets, setOutlets] = useState<any[]>([]);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        // If they are axios response objects, use .data.
        // 1. Process the data (handling axios vs raw array)
      const rolesData = roleRes.data || roleRes || [];
      const outletsData = outletRes.data || outletRes || [];

      // 2. CHECK IF EMPTY
      if (outletsData.length === 0) {
        console.warn("⚠️ ALERT: Outlets array is EMPTY from the server.");
      } else {
        console.log(`✅ SUCCESS: Found ${outletsData.length} outlets.`, outletsData);
      }

      if (rolesData.length === 0) {
        console.warn("⚠️ ALERT: Roles array is EMPTY from the server.");
      }

        setRoles(rolesData);
        setOutlets(outletsData);

        if (isEditMode && id) {
          const user = await userService.getUserById(id);
          //const assignedIds = user.userOutlets?.map((uo: any) => String(uo.outletId)) || [];

          // DEBUG: See what the user object actually contains
          console.log("Full User Object from API:", user);

          // We ensure they are strings to match your 'outlets' list IDs
          const assignedIds = Array.isArray(user.outletIds) 
            ? user.outletIds.map((val: any) => String(val)) 
            : [];

          console.log("Mapped IDs for State:", assignedIds);

          setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            password: '', 
            role: user.role || '',
            staffPin: user.staffPin || '',
            outletIds: assignedIds // This now correctly populates the array
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode && id) {
        await userService.update(id, formData);
      } else {
        await userService.create(formData);
      }
      navigate(PATHS.UserList);
    } catch (error: any) {
      console.error("Save Error:", error.response?.data);
      alert(error.response?.data?.message || "Error saving user.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="text-slate-500 font-medium">Loading user details...</p>
    </div>
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit User Account' : 'Create User Account'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage system access and POS credentials.</p>
        </div>
        <Link to={PATHS.UserList} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} className="mr-1" /> Back to List
        </Link>
      </div>

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
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${isEditMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500'}`} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Security Section with Roles */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Security & POS Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
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
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
                  onChange={(e) => setFormData({...formData, staffPin: e.target.value.replace(/\D/g, '')})} 
                />
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">{isEditMode ? 'Change Password (Optional)' : 'System Password'}</label>
              <input 
                type="password" required={!isEditMode} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Work Assignment Section */}
        <div className="p-6 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Outlet Assignment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
          <button 
            type="submit" 
            disabled={submitting}
            className="px-6 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-blue-700 transition-all flex items-center disabled:bg-slate-300"
          >
            {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
            {isEditMode ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditUser;