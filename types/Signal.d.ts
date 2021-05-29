export interface Signal {
  id: string;
  kind: string;
  peak?: Array<Partial<{ x: number; intensity: number; width: number }>>;
}
