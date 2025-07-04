import { AbstractControl, ValidationErrors } from '@angular/forms';

export function monthRangeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const month1 = control.get('month1')?.value;
  const month2 = control.get('month2')?.value;

  if (month1 !== null && month2 !== null && month1 > month2) {
    return { monthRange: true };
  }

  return null;
}
