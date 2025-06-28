export const MENU_ITEMS = [
  { label: 'Inicio', icon: 'home', route: '/dashboard', onlyAdmin: false },
  { label: 'Usuarios', icon: 'people', route: 'users', onlyAdmin: true },
  {
    label: 'Parametrización de alertas',
    icon: 'add_alert',
    route: 'alert-parameterization', 
    onlyAdmin: true
  },
  {
    label: 'Parametrización de pagos',
    icon: 'payments',
    route: 'payment-parameterization', 
    onlyAdmin: true
  },
  { label: 'Registrar apuestas', icon: 'casino', route: 'register-bets', onlyAdmin: false },
  { label: 'Vendedores', icon: 'store', route: 'vendors', onlyAdmin: true },
];
