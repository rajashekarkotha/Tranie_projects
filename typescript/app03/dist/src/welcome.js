"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const greet = function (username, salutation) {
    return "Hello " + (salutation ? salutation : "") + username;
};
exports.default = greet;
