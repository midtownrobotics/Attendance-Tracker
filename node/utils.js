"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANSIColorCodes = void 0;
exports.getFormattedDate = getFormattedDate;
exports.colorLog = colorLog;
function getFormattedDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    return `${month}-${day}-${year}`;
}
function colorLog(message, color) {
    console.log(`\x1b[${color}m` + message + "\x1b[0m");
}
var ANSIColorCodes;
(function (ANSIColorCodes) {
    ANSIColorCodes[ANSIColorCodes["Black"] = 30] = "Black";
    ANSIColorCodes[ANSIColorCodes["Red"] = 31] = "Red";
    ANSIColorCodes[ANSIColorCodes["Green"] = 32] = "Green";
    ANSIColorCodes[ANSIColorCodes["Yellow"] = 33] = "Yellow";
    ANSIColorCodes[ANSIColorCodes["Blue"] = 34] = "Blue";
    ANSIColorCodes[ANSIColorCodes["Magenta"] = 35] = "Magenta";
    ANSIColorCodes[ANSIColorCodes["Cyan"] = 36] = "Cyan";
    ANSIColorCodes[ANSIColorCodes["White"] = 37] = "White";
    ANSIColorCodes[ANSIColorCodes["BrightBlack"] = 90] = "BrightBlack";
    ANSIColorCodes[ANSIColorCodes["BrightRed"] = 91] = "BrightRed";
    ANSIColorCodes[ANSIColorCodes["BrightGreen"] = 92] = "BrightGreen";
    ANSIColorCodes[ANSIColorCodes["BrightYellow"] = 93] = "BrightYellow";
    ANSIColorCodes[ANSIColorCodes["BrightBlue"] = 94] = "BrightBlue";
    ANSIColorCodes[ANSIColorCodes["BrightMagenta"] = 95] = "BrightMagenta";
    ANSIColorCodes[ANSIColorCodes["BrightCyan"] = 96] = "BrightCyan";
    ANSIColorCodes[ANSIColorCodes["BrightWhite"] = 97] = "BrightWhite";
})(ANSIColorCodes || (exports.ANSIColorCodes = ANSIColorCodes = {}));
