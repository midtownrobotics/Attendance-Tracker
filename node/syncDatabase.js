"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const utils_1 = require("./utils");
function syncDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Sync all defined models to the DB
            yield sequelize_1.default.sync({ force: false }); // `force: false` prevents dropping the table if it exists
            (0, utils_1.colorLog)("Synced database succesfully", utils_1.ANSIColorCodes.Green);
        }
        catch (error) {
            (0, utils_1.colorLog)('Error synchronizing database:' + error, utils_1.ANSIColorCodes.Red);
        }
    });
}
exports.default = syncDatabase;
