// 1. Define the Root Segments
const ROOT = "/portal";
const CONFIG = `${ROOT}/config`;
const INVENTORY = `${ROOT}/inventory`;
const SALES = `${ROOT}/sales`;
const BILLING = `${ROOT}/billing`;

export const PATHS = {
  // **** AUTH & CORE ****
  LOGIN: `${ROOT}/login`,
  Register: `${ROOT}/register`,
  ForgotPassword: `${ROOT}/forgot-password`,
  ResetPassword: `${ROOT}/reset-password`,
  DASHBOARD: `${ROOT}/dashboard`,
  PROFILE: `${ROOT}/profile`,

  // **** USER MANAGEMENT ****
  UserList: `${CONFIG}/user-list`,
  ADD_USER: `${CONFIG}/user-list/add`,
  EDIT_USER: `${CONFIG}/user-list/edit`, // Note: Append /:id in Router, and /id in Link
  DELETE_USER: `${CONFIG}/user-list/delete`,

  // **** ROLE MANAGEMENT ****
  ROLEList: `${CONFIG}/role-list`,
  ADD_ROLE: `${CONFIG}/role-list/add`,
  EDIT_ROLE: `${CONFIG}/role-list/edit`,
  DELETE_ROLE: `${CONFIG}/role-list/delete`,

  // **** MENU MANAGEMENT ****
  MENUList: `${CONFIG}/menu-list`,
  ADD_MENU: `${CONFIG}/menu-list/add`,
  EDIT_MENU: `${CONFIG}/menu-list/edit`,
  DELETE_MENU: `${CONFIG}/menu-list/delete`,

  // **** CATEGORY MANAGEMENT ****
  CATEGORIESList: `${INVENTORY}/category-list`,
  ADD_CATEGORY: `${INVENTORY}/category-list/add`,
  EDIT_CATEGORY: `${INVENTORY}/category-list/edit`,
  DELETE_CATEGORY: `${INVENTORY}/category-list/delete`,

  // **** PRODUCT MANAGEMENT ****
  PRODUCTSList: `${INVENTORY}/product-list`,
  ADD_PRODUCT: `${INVENTORY}/product-list/add`,
  EDIT_PRODUCT: `${INVENTORY}/product-list/edit`,
  DELETE_PRODUCT: `${INVENTORY}/product-list/delete`,

  // **** OUTLET MANAGEMENT ****
  OUTLETSList: `${CONFIG}/outlet-list`,
  ADD_OUTLET: `${CONFIG}/outlet-list/add`,
  EDIT_OUTLET: `${CONFIG}/outlet-list/edit`,
  DELETE_OUTLET: `${CONFIG}/outlet-list/delete`,

  // **** CUSTOMER MANAGEMENT ****
  CUSTOMERSList: `${CONFIG}/customer-list`,
  ADD_CUSTOMER: `${CONFIG}/customer-list/add`,
  EDIT_CUSTOMER: `${CONFIG}/customer-list/edit`,
  DELETE_CUSTOMER: `${CONFIG}/customer-list/delete`,

  // **** SALE ORDER ****
  SALEORDER: `${SALES}/sales-order`,
  ADD_SALEORDER: `${SALES}/sales-order/add`,
  EDIT_SALEORDER: `${SALES}/sales-order/edit`,
  DELETE_SALEORDER: `${SALES}/sales-order/delete`,

  // **** INVENTORIES ****
  INVENTORIESLIST: `${INVENTORY}/inventories-list`,
  ADD_INVENTORY: `${INVENTORY}/inventories-list/add`,
  EDIT_INVENTORY: `${INVENTORY}/inventories-list/edit`,
  DELETE_INVENTORY: `${INVENTORY}/inventories-list/delete`,

  // **** BILLING ****
  INVOICESLIST: `${BILLING}/invoices-list`,
  ADD_INVOICE: `${BILLING}/invoices-list/add`,
  EDIT_INVOICE: `${BILLING}/invoices-list/edit`,
  DELETE_INVOICE: `${BILLING}/invoices-list/delete`,

  RECEIVABLESLIST: `${BILLING}/receivables-list`,
  ADD_RECEIVABLE: `${BILLING}/receivables-list/add`,
  EDIT_RECEIVABLE: `${BILLING}/receivables-list/edit`,
  DELETE_RECEIVABLE: `${BILLING}/receivables-list/delete`,
};