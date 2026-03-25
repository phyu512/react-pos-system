import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Store, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../paths';
import { fetchAllOutlets, deleteOutlet } from '../../services/outletService';

const OutletList = () => {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Inside your OutletList component
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOutlets();
  }, []);

  const loadOutlets = async () => {
    try {
      const data = await fetchAllOutlets();
      setOutlets(data);
    } catch (error) {
      console.error("Error loading outlets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this outlet?")) {
      try {
        await deleteOutlet(id);
        setOutlets(outlets.filter(o => o.outletId !== id));
      } catch (err: any) {
        // Capture the message from your C# catch block
        const apiMessage = err.response?.data?.message || "An unexpected error occurred.";
        setError(apiMessage);
        
        // Optional: Auto-hide error after 5 seconds
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const filtered = outlets.filter(o => 
    o.outletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.outletId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-500 text-sm tracking-tight">Accessing Store Records...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Detailed Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-full p-1">
                <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-red-800">Action Restricted</p>
                <p className="text-xs text-red-700 mt-0.5 font-medium">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Group Box Container (Existing Code) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header Section inside Group Box */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                <Store size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Store Outlets</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Branch Directory</p>
              </div>
            </div>

            <Link 
              to={PATHS.ADD_OUTLET} 
              className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl transition-all shadow-md font-bold text-sm active:scale-95"
            >
              <Plus size={18} />
              <span>Add New Outlet</span>
            </Link>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID, or city..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Branch Identity</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Physical Location</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((outlet) => (
                  <tr key={outlet.outletId} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          {outlet.shortLocation || outlet.outletName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-slate-800 text-sm">{outlet.outletName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{outlet.outletId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-600">
                        <MapPin size={14} className="mr-2 text-slate-400" />
                        <span className="text-sm font-medium">{outlet.location || 'No address provided'}</span>
                        {outlet.shortLocation && (
                           <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-black text-[9px] uppercase">
                             {outlet.shortLocation}
                           </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link 
                          to={`${PATHS.EDIT_OUTLET}/${outlet.outletId}`} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all hover:shadow-sm"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(outlet.outletId)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all hover:shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Store size={32} className="text-slate-200 mb-2" />
                      <p className="text-slate-400 font-medium text-sm">No outlets found matching "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Group Box Footer */}
        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Locations</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Total Branches: {filtered.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OutletList;