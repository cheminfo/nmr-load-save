export function getFileExtension(name: string): string {
  return name.replace(/^.*\./, '').toLowerCase();
}
