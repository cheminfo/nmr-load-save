"use strict";
exports.__esModule = true;
var BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var LENGTH = 8;
function generateID() {
    var id = '';
    for (var i = 0; i < LENGTH; i++) {
        id += BASE62.charAt(Math.floor(Math.random() * 62));
    }
    return id;
}
exports["default"] = generateID;
