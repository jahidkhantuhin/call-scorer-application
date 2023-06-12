export const hasNumber = (value: any) => /\d+/g.test(value);

export const hasSpecialCharacter = (value: string) =>
  /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?~]/.test(value);

export const hasUppercase = (value: string) =>
  value &&
  value
    .split("")
    .map((c) => /^[A-Z]*$/.test(c))
    .includes(true);

export const hasLowerCase = (value: string) =>
  value &&
  value
    .split("")
    .map((c) => /^[a-z]*$/.test(c))
    .includes(true);
