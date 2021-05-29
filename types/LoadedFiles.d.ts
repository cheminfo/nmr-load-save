import type { InputType } from 'jszip';

export interface LoadedFiles {
  name: string;
  extension?: string;
  binary: Partial<InputType>;
}
