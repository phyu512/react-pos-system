import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Filter, ChevronDown, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../paths';
import { userService } from '../../services/userService';
import axiosInstance from '../../api/axiosInstance';

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, roleResponse] = await Promise.all([
        userService.fetchAllUsers(),
        axiosInstance.get('/Roles')
      ]);
      
      setUsers(userResponse);
      setRoles(roleResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Could not load user records from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null); // Reset error state
    
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await axiosInstance.delete(`/Users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err: any) {
        // Capture the detailed message from your updated C# Try-Catch
        const apiMessage = err.response?.data?.message || "Failed to delete user due to a server error.";
        setError(apiMessage);
        
        // Auto-clear after 6 seconds
        setTimeout(() => setError(null), 6000);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      selectedRole === 'All Roles' || 
      user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-500">Syncing with database...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* --- Detailed Error Display --- */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <div>
                <p className="text-sm font-bold text-red-800">Security & Integrity Notice</p>
                <p className="text-xs text-red-700 font-medium mt-0.5">{error}</p>
              </div>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header... (Keep existing code) */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">User Management</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Directory & Permissions</p>
            </div>
          </div>
        </div>

        {/* Filter Bar... (Keep existing code) */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
              />
            </div>

            <div className="relative min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer"
              >
                <option value="All Roles">All Roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>

            <Link 
              to={PATHS.ADD_USER}
              className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl transition-all shadow-md font-bold text-sm active:scale-95"
            >
              <Plus size={18} />
              <span>Add New User</span>
            </Link>
          </div>
        </div>

        {/* Table... (Keep existing code) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-slate-800 text-sm">{user.fullName}</p>
                          <p className="text-slate-400 text-xs font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tight">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link 
                          to={`${PATHS.EDIT_USER}/${user.id}`} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all hover:shadow-sm"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(user.id)}
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
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 font-medium text-sm">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Linked</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Showing {filteredUsers.length} of {users.length} Users
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserList;