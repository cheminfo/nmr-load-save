declare module 'nmredata' {
  class NmrRecord {
    static toJSON(
      options: any
    ): Promise<any>
  }

  function parseSDF(
    sdf: string,
    options: any,
  ): any
}