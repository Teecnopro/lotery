export enum MODULES {
    AUTH = 'auth',
    USER = 'user',
    PAYMENT = 'payment',
    ALERT_PARAMETERIZATION = 'alert-parameterization',
    REGISTER_BETS = 'register-bets',
    VENDOR = 'vendor',
    DELETE_BETS = 'delete-bets',
}

export const NAME_MODULES: { [key in MODULES]: string } = {
    [MODULES.AUTH]: 'Autenticación',
    [MODULES.USER]: 'Usuarios',
    [MODULES.PAYMENT]: 'Parametrización de pagos',
    [MODULES.ALERT_PARAMETERIZATION]: 'Parametrización de alertas',
    [MODULES.REGISTER_BETS]: 'Registrar apuestas',
    [MODULES.VENDOR]: 'Vendedores',
    [MODULES.DELETE_BETS]: 'Eliminar apuestas'
}
