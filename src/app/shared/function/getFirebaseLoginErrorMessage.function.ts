import { FirebaseError } from '@angular/fire/app';

export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code = (error as FirebaseError)?.code ?? 'Desconocido';

  const map: Record<string, string> = {
    'auth/user-not-found': 'El usuario no existe.',
    'auth/user-disabled': 'Este usuario ha sido deshabilitado.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta luego.',
    'auth/invalid-credential': 'Credenciales invalidas.',
    'auth/email-already-in-use': 'El email ya se encuentra en uso.',
  };

  return map[code] || 'Ocurrió un error inesperado.';
}
