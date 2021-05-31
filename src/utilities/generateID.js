"use strict";

exports.__esModule = true;
let BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let LENGTH = 8;
function generateID() {
    let id = '';
    for (let i = 0; i < LENGTH; i++) {
        id += BASE62.charAt(Math.floor(Math.random() * 62));
    }
    return id;
}
exports.default = generateID;
