export const ROLES = {
  ADMINISTRATOR: 'IT Administrator',
  SALE_SUPERVISOR: 'Sale Supervisor',
  SALE_MAN: 'Sale Man',
  INVENTORY_MANAGER: 'Inventory Manager'
};

export const ROLESGROUP = {
  // Use an array so .includes() works correctly in the Router and Sidebar
  SALE: [ROLES.SALE_SUPERVISOR, ROLES.SALE_MAN],
};