import { ValidatorFn } from "@angular/forms";

export function appEmailValidator(): ValidatorFn {

  const regExp = new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`);

  return (control) => {
    const x = control.value;
    const z = regExp.test(control.value);
    return control.value === "" || regExp.test(control.value)
      ? null
      : { appEmailValidator: true };
  };
}
