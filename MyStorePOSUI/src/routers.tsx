import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './constants/roles';
import IdleTimer from './components/IdleTimer';

// Import components
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword'; 
import ResetPassword from './components/ResetPassword';   
import Register from './components/Register'; 
import UserList from './components/config/UserList';
import AddEditUser from './components/config/AddEditUser';
import OutletList from './components/config/OutletList';
import AddEditOutlet from './components/config/AddEditOutlet';

/**
 * HELPER: rel()
 * Strips the "/portal/" prefix from PATHS constants.
 */
const rel = (path: string) => path.replace('/portal/', '');

export const router = createBrowserRouter([
  // **** PUBLIC ROUTES ****
  { path: PATHS.LOGIN, element: <Login /> },
  { path: PATHS.ForgotPassword, element: <ForgotPassword /> },
  { path: PATHS.Register, element: <Register /> },
  { path: PATHS.ResetPassword, element: <ResetPassword /> },

  {   
    path: "/portal", 
    element: (
      <IdleTimer>
        <MainLayout />
      </IdleTimer>
    ), 
    children: [
      {
        element: <ProtectedRoute />, 
        children: [
          {
            index: true,
            element: <Navigate to={PATHS.DASHBOARD} replace />,
          },
          {
            path: rel(PATHS.DASHBOARD),
            element: <div className="p-4 bg-white rounded shadow">Dashboard Content</div>,
          },

          // LEVEL 2: Sale Operations
          {
            element: <ProtectedRoute allowedRoles={[ROLES.SALE_MAN, ROLES.SALE_SUPERVISOR, ROLES.ADMINISTRATOR]} />,
            children: [
              { path: rel(PATHS.CUSTOMERSList), element: <div className="p-4 bg-white rounded shadow">Customer List</div> },
              { path: rel(PATHS.SALEORDER), element: <div className="p-4 bg-white rounded shadow">Orders</div> },
              { path: rel(PATHS.INVOICESLIST), element: <div className="p-4 bg-white rounded shadow">Invoices</div> },
              { path: rel(PATHS.RECEIVABLESLIST), element: <div className="p-4 bg-white rounded shadow">Receivables</div> },
            ]
          },

          // LEVEL 3: IT Administrator Only
          {
            element: <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]} />,
            children: [
              // **** USER MANAGEMENT ****
              { path: rel(PATHS.UserList), element: <UserList /> },
              { path: rel(PATHS.ADD_USER), element: <AddEditUser /> },
              { path: rel(PATHS.EDIT_USER) + "/:id", element: <AddEditUser /> }, // Added /:id

              // **** ROLE MANAGEMENT ****
              { path: rel(PATHS.ROLEList), element: <div className="p-4 bg-white rounded shadow">Role List</div> },
              { path: rel(PATHS.ADD_ROLE), element: <div className="p-4 bg-white rounded shadow">Add Role</div> },
              { path: rel(PATHS.EDIT_ROLE) + "/:id", element: <div className="p-4 bg-white rounded shadow">Edit Role</div> },

              // **** MENU MANAGEMENT ****
              { path: rel(PATHS.MENUList), element: <div className="p-4 bg-white rounded shadow">Menu List</div> },
              { path: rel(PATHS.ADD_MENU), element: <div className="p-4 bg-white rounded shadow">Add Menu</div> },
              { path: rel(PATHS.EDIT_MENU) + "/:id", element: <div className="p-4 bg-white rounded shadow">Edit Menu</div> },

              // **** OUTLETS MANAGEMENT ****
              { path: rel(PATHS.OUTLETSList), element: <OutletList /> },
              { path: rel(PATHS.ADD_OUTLET), element: <AddEditOutlet /> },
              { path: rel(PATHS.EDIT_OUTLET) + "/:id", element: <AddEditOutlet /> },

              // **** INVENTORY MANAGEMENT ****
              { path: rel(PATHS.CATEGORIESList), element: <div className="p-4 bg-white rounded shadow">Category List</div> },
              { path: rel(PATHS.PRODUCTSList), element: <div className="p-4 bg-white rounded shadow">Product List</div> },
              { path: rel(PATHS.INVENTORIESLIST), element: <div className="p-4 bg-white rounded shadow">Inventory List</div> },
            ]
          },
        ],
      },
    ],
  },

  { path: "/", element: <Navigate to="/portal" replace /> },
  { path: "*", element: <Navigate to={PATHS.LOGIN} replace /> },
]);