export enum ACTIONS {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    READ = 'read',
};

export const ACTIONS_LOGBOOK = {
    [ACTIONS.CREATE]: 'Creación',
    [ACTIONS.UPDATE]: 'Actualización',
    [ACTIONS.DELETE]: 'Eliminación',
    [ACTIONS.READ]: 'Lectura',
};
