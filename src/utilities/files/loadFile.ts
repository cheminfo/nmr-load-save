// import { LoadedFiles } from '../../../types/LoadedFiles';
// import { getFileName } from './getFileName';
// import { getFileExtension } from './getFileExtension';
// import { LoadFilesFromZipOptions } from '../../../types/LoadFilesFromZipOptions';

// type Binary = BufferSource | string;

// export function loadFiles(acceptedFiles, options: LoadFilesFromZipOptions = {}): Promise<LoadedFiles[]> {
//   let promises: Array<any> = [];
//   for (let file of acceptedFiles) {
//     let promise = new Promise((resolve, reject) => {
//       const reader = new FileReader();
//         reader.onabort = (e) => reject(e);
//         reader.onerror = (e) => reject(e);
//         reader.onload = () => {
//           if (reader.result) {
//             const binary: Binary = reader.result;
//             const name: string = getFileName(file.name);
//             const extension: string = getFileExtension(file.name);
//             resolve({ binary, name, extension });
//           }
//         };
//         if (options.asBuffer) {
//           reader.readAsArrayBuffer(file);
//         } else {
//           reader.readAsBinaryString(file);
//         }
//     });
//   }
//   return Promise.all(promises);
// }