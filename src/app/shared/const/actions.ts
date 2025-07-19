export enum ACTIONS {
    AUTHENTICATE = 'loguin',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    ACTIVATE = 'activate',
    DEACTIVATE = 'deactivate',
    RECOVER_PASSWORD = 'recover_password',
    LOGOUT = 'logout',
};

export const ACTIONS_LOGBOOK = {
    [ACTIONS.AUTHENTICATE]: 'Logueo',
    [ACTIONS.CREATE]: 'Creación',
    [ACTIONS.UPDATE]: 'Actualización',
    [ACTIONS.DELETE]: 'Eliminación',
    [ACTIONS.ACTIVATE]: 'Activación',
    [ACTIONS.DEACTIVATE]: 'Desactivación',
    [ACTIONS.RECOVER_PASSWORD]: 'Recuperación de contraseña',
    [ACTIONS.LOGOUT]: 'Cierre de sesión',
};
