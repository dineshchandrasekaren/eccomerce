export const isEmail = (email: string): boolean =>
  new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/).test(email);
