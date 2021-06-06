export function isString(binary: string|ArrayBuffer): binary is string {
  return typeof (binary as string) === 'string';
}