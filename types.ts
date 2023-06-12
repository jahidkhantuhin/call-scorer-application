export interface User {}

export interface UserStore {
  users: Array<User>;
  loading: Boolean;
}

export interface Client {}

export interface Theme {
  isDark: Boolean;
}

export interface Snackbar {
  isVisible: Boolean;
  text: String;
  multiLine: Boolean;
  outlined: Boolean;
  width: String;
  shaped: Boolean;
  tile: Boolean;
  timeout: number;
}
