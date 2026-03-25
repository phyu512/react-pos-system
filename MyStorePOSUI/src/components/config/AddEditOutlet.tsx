import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Store, MapPin, Sparkles, Plus } from 'lucide-react';
import { PATHS } from '../../paths';
import { fetchOutletById, createOutlet, updateOutlet } from '../../services/outletService';

const AddEditOutlet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    outletId: '',
    outletName: '',
    location: '',
    shortLocation: '',
    // Always send an empty array by default
    userOutlets: []
  });

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      fetchOutletById(id).then(data => setFormData(data));
    }
  }, [id, isEditMode]);

  // AUTO-GENERATE ID LOGIC
  useEffect(() => {
    if (!isEditMode && formData.shortLocation.length === 3) {
      const timestamp = Date.now().toString().slice(-4);
      const generatedId = `${formData.shortLocation.toUpperCase()}-${new Date().getFullYear()}-${timestamp}`;
      setFormData(prev => ({ ...prev, outletId: generatedId }));
    } else if (!isEditMode && formData.shortLocation.length < 3) {
      setFormData(prev => ({ ...prev, outletId: '' }));
    }
  }, [formData.shortLocation, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Clear previous error

    try {
      if (isEditMode && id) {
        await updateOutlet(id, formData);
      } else {
        await createOutlet(formData);
      }
      navigate(PATHS.OUTLETSList);
    } catch (error: any) {
      // Check for standard ASP.NET Core Validation error structure
      const message = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.message || error.response?.data || "An unexpected error occurred.";
        
      setApiError(String(message));
    }
  };

  return (
    <div className="pt-4 space-y-6">
      {/* Back Button Link */}
      <div className="flex items-center px-2">
        <Link 
          to={PATHS.OUTLETSList} 
          className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg mr-2 group-hover:border-blue-200">
            <ArrowLeft size={16} />
          </div>
          Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Integrated Group Box Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <Store size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {isEditMode ? 'Edit Store Outlet' : 'New Store Outlet'}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                {isEditMode ? `System ID: ${id}` : 'Configure branch identity'}
              </p>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="mx-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-bold text-red-600 flex items-center">
              <span className="mr-2">⚠️</span> {apiError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-8">
            {/* ID Generation Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Short Location (3 Char)
                </label>
                <input 
                  type="text" required maxLength={3} placeholder="e.g. NYC"
                  disabled={isEditMode}
                  className={`w-full px-4 py-3 border border-slate-200 rounded-xl outline-none transition-all uppercase text-center font-black tracking-widest text-sm ${
                    isEditMode ? 'bg-slate-50 text-slate-400' : 'focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-blue-600'
                  }`}
                  value={formData.shortLocation}
                  onChange={(e) => setFormData({...formData, shortLocation: e.target.value.toUpperCase()})}
                />
                {!isEditMode && <p className="text-[10px] text-slate-400 font-medium italic">Type 3 letters to generate ID</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  Generated Outlet ID { !isEditMode && <Sparkles size={12} className="ml-2 text-orange-400 animate-pulse" /> }
                </label>
                <input 
                  type="text" readOnly
                  className="w-full px-4 py-3 border border-slate-100 bg-slate-50 rounded-xl outline-none font-bold text-sm text-slate-500 cursor-not-allowed"
                  value={formData.outletId}
                  placeholder={isEditMode ? "" : "Waiting for short code..."}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* General Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Outlet Name</label>
                <input 
                  type="text" required placeholder="Downtown Branch"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm"
                  value={formData.outletName}
                  onChange={(e) => setFormData({...formData, outletName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Address / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                  <input 
                    type="text" placeholder="123 Street Name, City"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={() => navigate(-1)} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={!formData.outletId}
              className={`inline-flex items-center space-x-2 px-8 py-3 rounded-xl transition-all shadow-lg font-bold text-sm active:scale-95 ${
                !formData.outletId ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-slate-900 hover:bg-blue-600 text-white shadow-slate-200'
              }`}
            >
              {isEditMode ? <Save size={18} /> : <Plus size={18} />}
              <span>{isEditMode ? 'Update Record' : 'Create Outlet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditOutlet;