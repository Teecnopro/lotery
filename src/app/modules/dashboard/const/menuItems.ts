export const MENU_ITEMS = [
  { label: 'Inicio', icon: 'home', route: '/dashboard', onlyAdmin: false },
  { label: 'Usuarios', icon: 'people', route: 'users', onlyAdmin: true },
  {
    label: 'Parametrización de alertas',
    icon: 'add_alert',
    route: 'alert-parameterization',
    onlyAdmin: true,
  },
  {
    label: 'Parametrización de pagos',
    icon: 'payments',
    route: 'payment-parameterization',
    onlyAdmin: true,
  },
  {
    label: 'Registrar apuestas',
    icon: 'casino',
    route: 'register-bets',
    onlyAdmin: false,
  },
  { label: 'Eliminar Apuestas', icon: 'delete', route: 'delete-bets', onlyAdmin: true },
  { label: 'Vendedores', icon: 'store', route: 'vendors', onlyAdmin: true },
  { label: 'Consultar aciertos', icon: 'check_circle', route: 'check-hits', onlyAdmin: false },
  { label: 'Reportes', icon: 'dashboard_2', route: 'reports', onlyAdmin: true },
  { label: 'Bitacora', icon: 'book', route: 'logbook', onlyAdmin: true },
];
