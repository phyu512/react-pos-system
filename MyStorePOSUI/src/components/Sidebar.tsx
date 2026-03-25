import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  X, 
  LogOut, 
  Users, 
  ShieldCheck, 
  Menu as MenuIcon,
  ChevronDown,
  Store,
  Layers,      
  UserSquare,  
  ShoppingCart,
  FileText,    
  Wallet
} from 'lucide-react';
import { PATHS } from '../paths';
import { ROLES, ROLESGROUP } from '../constants/roles';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible States
  const [openGroups, setOpenGroups] = useState({
    inventory: true,
    sales: true,
    billing: true,
    config: true
  });

  const toggleGroup = (group: keyof typeof openGroups) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // --- AUTH LOGIC ---
  const savedUser = localStorage.getItem('user');
  const userData = savedUser ? JSON.parse(savedUser) : null;
  
  // Normalize role: trim to ensure exact matching with constants
  const userRole = userData?.role?.trim() || ''; 
  const permissions = userData?.permissions || [];

  const isActive = (path: string) => location.pathname === path;

  /**
   * Helper to check permissions.
   * IT Administrator bypasses all permission checks.
   */
  const canView = (permissionName: string) => {
    if (userRole === ROLES.ADMINISTRATOR) return true; 
    return permissions.includes(permissionName);
  };

  /**
   * Helper to check if user belongs to the Sales group.
   * ROLESGROUP.SALE is an array, so we check if it includes the current userRole.
   */
  const isSalesStaff = ROLESGROUP.SALE.includes(userRole);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate(PATHS.LOGIN, { replace: true });
    if (isOpen) toggleSidebar();
  };

  const navItemClass = (path: string) => `
    flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 mb-1
    ${isActive(path) 
      ? 'bg-white shadow-sm border border-slate-200 text-blue-600 font-bold' 
      : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900'}
  `;

  const groupHeaderClass = "w-full px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between items-center group hover:text-slate-600 transition-colors mt-4 first:mt-0";

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-50 text-slate-900 border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* LOGO SECTION */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-white shadow-sm">
          <Link to="/portal/dashboard" className="flex items-center no-underline">
            <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg shadow-sm shrink-0 border border-slate-200">
              <span className="text-orange-500 text-xl font-black">★</span>
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-lg font-black text-blue-900 leading-none tracking-tight">STAR LINK</span>
              <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">Trading</span>
            </div>
          </Link>
          <button onClick={toggleSidebar} className="ml-auto md:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="overflow-y-auto h-[calc(100vh-160px)] p-4 space-y-2">
          
          {/* DASHBOARD SECTION */}
          <div className="mb-4">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">General</p>
            <Link to={PATHS.DASHBOARD} className={navItemClass(PATHS.DASHBOARD)}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* CONFIGURATION SECTION */}
          {(userRole === ROLES.ADMINISTRATOR || isSalesStaff) && (
            <div>
              <button onClick={() => toggleGroup('config')} className={groupHeaderClass}>
                <span>Configuration</span>
                <ChevronDown size={12} className={`transition-transform ${openGroups.config ? '' : '-rotate-90'}`} />
              </button>
              
              <div className={`space-y-1 overflow-hidden transition-all duration-300 ${openGroups.config ? 'max-h-[500px]' : 'max-h-0'}`}>
                {/* ADMIN ONLY ITEMS: Users, Outlets, Roles, Menu */}
                {userRole === ROLES.ADMINISTRATOR && (
                  <>
                    <Link to={PATHS.UserList} className={navItemClass(PATHS.UserList)}> <Users size={18} /> <span>Users</span> </Link>
                    <Link to={PATHS.OUTLETSList} className={navItemClass(PATHS.OUTLETSList)}> <Store size={18} /> <span>Outlets</span> </Link>
                    <Link to={PATHS.ROLEList} className={navItemClass(PATHS.ROLEList)}> <ShieldCheck size={18} /> <span>Roles</span> </Link>
                    <Link to={PATHS.MENUList} className={navItemClass(PATHS.MENUList)}> <MenuIcon size={18} /> <span>Menu</span> </Link>
                  </>
                )}
                                
                {/* CUSTOMERS: Logic checks permissions via canView (which includes Admin bypass) */}
                {canView('customers.view') && (
                  <Link to={PATHS.CUSTOMERSList} className={navItemClass(PATHS.CUSTOMERSList)}>
                    <UserSquare size={18} /> <span>Customers</span>
                  </Link>
                )}
                
              </div>
            </div>
          )}

          {/* INVENTORY SECTION */}
          {(userRole === ROLES.ADMINISTRATOR || userRole === ROLES.INVENTORY_MANAGER) && (
            <div>
              <button onClick={() => toggleGroup('inventory')} className={groupHeaderClass}>
                <span>Inventory</span>
                <ChevronDown size={12} className={`transition-transform ${openGroups.inventory ? '' : '-rotate-90'}`} />
              </button>
              <div className={`space-y-1 overflow-hidden transition-all duration-300 ${openGroups.inventory ? 'max-h-96' : 'max-h-0'}`}>
                <Link to={PATHS.CATEGORIESList} className={navItemClass(PATHS.CATEGORIESList)}>
                  <Layers size={20} /> <span>Categories</span>
                </Link>
                <Link to={PATHS.PRODUCTSList} className={navItemClass(PATHS.PRODUCTSList)}>
                  <Package size={20} /> <span>Products</span>
                </Link>
                <Link to={PATHS.INVENTORIESLIST} className={navItemClass(PATHS.INVENTORIESLIST)}>
                  <Store size={20} /> <span>Stock List</span>
                </Link>
              </div>
            </div>
          )}

          {/* SALES SECTION */}
          {(userRole === ROLES.ADMINISTRATOR || isSalesStaff) && (
            <div>
              <button onClick={() => toggleGroup('sales')} className={groupHeaderClass}>
                <span>Sales</span>
                <ChevronDown size={12} className={`transition-transform ${openGroups.sales ? '' : '-rotate-90'}`} />
              </button>
              <div className={`space-y-1 overflow-hidden transition-all duration-300 ${openGroups.sales ? 'max-h-96' : 'max-h-0'}`}>
                <Link to={PATHS.SALEORDER} className={navItemClass(PATHS.SALEORDER)}> 
                  <ShoppingCart size={20}/> <span>Sales Orders</span> 
                </Link>
              </div>
            </div>
          )}

          {/* BILLING SECTION */}
          {(userRole === ROLES.ADMINISTRATOR || isSalesStaff) && (
            <div>
              <button onClick={() => toggleGroup('billing')} className={groupHeaderClass}>
                <span>Billing</span>
                <ChevronDown size={12} className={`transition-transform ${openGroups.billing ? '' : '-rotate-90'}`} />
              </button>
              <div className={`space-y-1 overflow-hidden transition-all duration-300 ${openGroups.billing ? 'max-h-96' : 'max-h-0'}`}>
                <Link to={PATHS.INVOICESLIST} className={navItemClass(PATHS.INVOICESLIST)}> 
                  <FileText size={20}/> <span>Invoices</span> 
                </Link>
                <Link to={PATHS.RECEIVABLESLIST} className={navItemClass(PATHS.RECEIVABLESLIST)}> 
                  <Wallet size={20}/> <span>Receivables</span> 
                </Link>
              </div>
            </div>
          )}

          

        </div>

        {/* Logout Section */}
        <div className="absolute bottom-0 w-full py-4 px-6 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 font-bold text-xs uppercase tracking-wide group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Spacer for desktop layout */}
      <div className={`hidden md:block transition-all duration-300 ${isOpen ? 'w-72' : 'w-0'}`} />
    </>
  );
};

export default Sidebar;