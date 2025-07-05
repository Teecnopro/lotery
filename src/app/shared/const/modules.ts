export enum MODULES {
    AUTH = 'auth',
    USER = 'user',
    PAYMENT = 'payment',
    ALERT_PARAMETERIZATION = 'alert-parameterization',
    REGISTER_BETS = 'register-bets',
    VENDOR = 'vendor',
    CHECK_HITS = 'check-hits',
    REPORTS = 'reports',
}

export const NAME_MODULES: { [key in MODULES]: string } = {
    [MODULES.AUTH]: 'Autenticación',
    [MODULES.USER]: 'Usuarios',
    [MODULES.PAYMENT]: 'Parametrización de pagos',
    [MODULES.ALERT_PARAMETERIZATION]: 'Parametrización de alertas',
    [MODULES.REGISTER_BETS]: 'Registrar apuestas',
    [MODULES.VENDOR]: 'Vendedores',
    [MODULES.CHECK_HITS]: 'Verificación de aciertos',
    [MODULES.REPORTS]: 'Reportes',
}