# nmr-load-save

<p align="center">
  Package to load and save NMR spectra.
</p>
<p align="center">
  <img alt="NMReDATA" src="images/readDiagram.png">
</p>



## Installation

`$ npm i nmr-load-save`

## Usage

```js
import NmrLoadSave from 'nmr-load-save';

// we can read a molfile or a jcamp
readText(arrayBuffer|string) {
  const text = ensureString(value)
  // jcamp if contains ##title
  // molfile if contains v2000 or v3000
  return {
    spectra: [],
    molecules: [],
  }
}

read(arrayBuffer|string, filename) {
  // based on extension we should try to guess the format


  return {
    spectra: [],
    molecules: [],
  }
}

```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/nmr-load-save.svg
[npm-url]: https://www.npmjs.com/package/nmr-load-save
[ci-image]: https://github.com/cheminfo/nmr-load-save/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/nmr-load-save/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/nmr-load-save.svg
[codecov-url]: https://codecov.io/gh/cheminfo/nmr-load-save
[download-image]: https://img.shields.io/npm/dm/nmr-load-save.svg
[download-url]: https://www.npmjs.com/package/nmr-load-save
