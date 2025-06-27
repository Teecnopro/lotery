import { FirebaseError } from '@angular/fire/app';

export function getFirebaseLoginErrorMessage(error: unknown): string {
  const code = (error as FirebaseError)?.code ?? 'Desconocido';

  const map: Record<string, string> = {
    'auth/user-not-found': 'El usuario no existe.',
    'auth/user-disabled': 'Este usuario ha sido deshabilitado.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta luego.',
    'auth/invalid-credential': 'Credenciales invalidas.',
  };

  return map[code] || 'Ocurrió un error inesperado.';
}
