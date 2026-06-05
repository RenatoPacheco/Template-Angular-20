export type InputBoolean = boolean | 'true' | 'false' | '';
export type InputNumber = number | string;

export type InputVariant = Variant | 'error' | '';
export type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'light'
  | 'dark';