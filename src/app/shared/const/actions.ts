export enum ACTIONS {
    AUTHENTICATE = 'authenticate',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    ACTIVATE = 'activate',
    DEACTIVATE = 'deactivate',
};

export const ACTIONS_LOGBOOK = {
    [ACTIONS.AUTHENTICATE]: 'Autenticación',
    [ACTIONS.CREATE]: 'Creación',
    [ACTIONS.UPDATE]: 'Actualización',
    [ACTIONS.DELETE]: 'Eliminación',
    [ACTIONS.ACTIVATE]: 'Activación',
    [ACTIONS.DEACTIVATE]: 'Desactivación',
};
