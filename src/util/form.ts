export const toFormSelection = <T>(value: T) => ({ label: value, value });

export interface AntdSelectOption {
  label: number | string;
  value: number | string;
}