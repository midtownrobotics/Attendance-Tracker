"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const MemberModel_1 = __importDefault(require("./MemberModel"));
const AttendanceModel_1 = __importDefault(require("./AttendanceModel"));
const MeetingModel_1 = __importDefault(require("./MeetingModel"));
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'sqlite',
    storage: './storage/database.sqlite',
    models: [MeetingModel_1.default, MemberModel_1.default, AttendanceModel_1.default],
    logging: false
});
exports.default = sequelize;
