"use strict";
exports.__esModule = true;
exports.FILES_TYPES = exports.getData = void 0;
function getData(spectra) {
    var x = spectra[0] && spectra[0].data && spectra[0].data.x ? spectra[0].data.x : [];
    var re = spectra[0] && spectra[0].data && spectra[0].data.y ? spectra[0].data.y : [];
    var im = spectra[1] && spectra[1].data && spectra[1].data.y
        ? spectra[1].data.y
        : null;
    if (x[0] > x[1]) {
        x.reverse();
        re.reverse();
        if (im)
            im.reverse();
    }
    return { x: x, re: re, im: im };
}
exports.getData = getData;
exports.FILES_TYPES = {
    MOL: 'mol',
    NMRIUM: 'nmrium',
    JSON: 'json',
    DX: 'dx',
    JDX: 'jdx',
    JDF: 'jdf',
    ZIP: 'zip',
    NMREDATA: 'nmredata'
};
