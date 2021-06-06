export function getFileName(name: string): string {
  return name.substr(0, name.lastIndexOf('.'));
}
