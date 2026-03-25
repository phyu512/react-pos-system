export const PATHS = {
  LOGIN: "/portal/login",
  Register: "/portal/register",
  ForgotPassword: "/portal/forgot-password",
  ResetPassword: "/portal/reset-password",
  DASHBOARD: "/portal/dashboard",
  PROFILE: "/portal/profile",

  //**** USER ****/
  UserList: "/portal/config/user-list",
  ADD_USER: "/portal/config/user-list/add",
  EDIT_USER: "/portal/config/user-list/edit/:id",
  DELETE_USER: "/portal/config/user-list/delete/:id",

  //**** ROLE ****/
  ROLEList: "/portal/config/role-list",
  ADD_ROLE: "/portal/config/role-list/add",
  EDIT_ROLE: "/portal/config/role-list/edit/:id",
  DELETE_ROLE: "/portal/config/role-list/delete/:id",

  //**** MENU ****/
  MENUList: "/portal/config/menu-list",
  ADD_MENU: "/portal/config/menu-list/add",
  EDIT_MENU: "/portal/config/menu-list/edit/:id",
  DELETE_MENU: "/portal/config/menu-list/delete/:id",

  //**** CATEGORY ****/
  CATEGORIESList: "/portal/inventory/category-list",
  ADD_CATEGORY: "/portal/inventory/category-list/add",
  EDIT_CATEGORY: "/portal/inventory/category-list/edit/:id",
  DELETE_CATEGORY: "/portal/inventory/category-list/delete/:id",

  //**** PRODUCT ****/
  PRODUCTSList: "/portal/inventory/product-list",
  ADD_PRODUCT: "/portal/inventory/product-list/add",
  EDIT_PRODUCT: "/portal/inventory/product-list/edit/:id",
  DELETE_PRODUCT: "/portal/inventory/product-list/delete/:id",

  //**** OUTLET ****/
  OUTLETSList: "/portal/config/outlet-list",
  ADD_OUTLET: "/portal/config/outlet-list/add",
  EDIT_OUTLET: "/portal/config/outlet-list/edit/:id",
  DELETE_OUTLET: "/portal/config/outlet-list/delete/:id",

  //**** CUSTOMER ****/
  CUSTOMERSList: "/portal/config/customer-list",
  ADD_CUSTOMER: "/portal/config/customer-list/add",
  EDIT_CUSTOMER: "/portal/config/customer-list/edit/:id",
  DELETE_CUSTOMER: "/portal/config/customer-list/delete/:id",

  //**** SALE ORDER ****/
  SALEORDER: "/portal/sales/sales-order",
  ADD_SALEORDER: "/portal/sales/sales-order/add",
  EDIT_SALEORDER: "/portal/sales/sales-order/edit/:id",
  DELETE_SALEORDER: "/portal/sales/sales-order/delete/:id",

  //**** Inventories ****/
  INVENTORIESLIST: "/portal/inventory/inventories-list",
  ADD_INVENTORY: "/portal/inventory/outlet-list/add",
  EDIT_INVENTORY: "/portal/inventory/outlet-list/edit/:id",
  DELETE_INVENTORY: "/portal/inventory/outlet-list/delete/:id",

    //**** Billing ****/
  INVOICESLIST: "/portal/billing/invoices-list",
  ADD_INVOICE: "/portal/billing/invoices-list/add",
  EDIT_INVOICE: "/portal/billing/invoices-list/edit/:id",
  DELETE_INVOICE: "/portal/billing/invoices-list/delete/:id",

  RECEIVABLESLIST: "/portal/billing/receivables-list",
  ADD_RECEIVABLE: "/portal/billing/receivables-list/add",
  EDIT_RECEIVABLE: "/portal/billing/receivables-list/edit/:id",
  DELETE_RECEIVABLE: "/portal/billing/receivables-list/delete/:id",

};