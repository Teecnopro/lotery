export enum ACTIONS {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    READ = 'read',
    ACTIVATE = 'activate',
    DEACTIVATE = 'deactivate',
};

export const ACTIONS_LOGBOOK = {
    [ACTIONS.CREATE]: 'Creación',
    [ACTIONS.UPDATE]: 'Actualización',
    [ACTIONS.DELETE]: 'Eliminación',
    [ACTIONS.READ]: 'Lectura',
    [ACTIONS.ACTIVATE]: 'Activación',
    [ACTIONS.DEACTIVATE]: 'Desactivación',
};
