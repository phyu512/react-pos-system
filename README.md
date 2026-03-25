##StarLink Trading - Full-Stack POS System

A modern Point of Sale solution featuring using a .NET CORE for backend and a REACT TYPESCRIPT for frontend.

##Security & Identity
This system implements a professional Identity and Access Management layer using ASP.NET Core Identity.
Role-Based Access Control (RBAC) -
#IT Administrator: Full system authority
#Sale Supervisor: Restricted to Sales menus, Customers, and POS transactions.
#Inventory Manager: Access to Categories, Products, Stock and Warehouse data.
#Zero-Trust Onboarding: New self-registered users are restricted to the Dashboard only until an Administrator assigns a functional role.
Session Guard: an Auto-Logout features that triggers after 10 minutes of inactivity to protect unattended terminals. 
Account Recovery: Supports self-service "Forgot Password" flows and Administrator will reset password to a system default Password@123.

##Technical Architecture & Integrity
Relational Integrity: Strict Foreign Key Constraints prevent data anomalies (e.g., an Outlet cannot be deleted if active Users are assigned to it). An Administrator cannot delete their own account. 
Modern Styling: Built with Tailwind CSS for a responsive professional UI.
API Security: All endpoints are secured via JWT (JSON Web Tokens) with Axios interceptors for seamless token handling.

##Tech Stack
Backend:.NET Core, C#, Entity Framework Core, SQL Server, ASP.NET Identity.
Frontend: React 19, TypeScript, Tailwind CSS, Lucide Icons, React Router.
DevOps: Git Monorepo structure with automated .gitignore for clean deployments.

##Getting Started & Testing
| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **IT Administrator** | admin@starlink.com | Password@123 | Full Access |
| **Sale Supervisor** | salesupervisor@starlink.com | Password@123 | Dashboard, Customers, Sales, Invoices |

##Installation & Setup
Backend: Navigate to `MyStorePOSAPI`, run `dotnet restore`, then `dotnet run`.
Frontend: Navigate to `MyStorePOSUI`, run `npm install`, then `npm start`.
