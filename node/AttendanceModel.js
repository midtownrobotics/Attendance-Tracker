"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var AttendanceModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const MemberModel_1 = __importDefault(require("./MemberModel"));
let AttendanceModel = AttendanceModel_1 = class AttendanceModel extends sequelize_typescript_1.Model {
    static removeAllByDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield AttendanceModel_1.findAll()).forEach((m) => {
                if (m.date == date) {
                    m.destroy();
                }
            });
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], AttendanceModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => MemberModel_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], AttendanceModel.prototype, "memberId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => MemberModel_1.default),
    __metadata("design:type", MemberModel_1.default)
], AttendanceModel.prototype, "member", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false }),
    __metadata("design:type", String)
], AttendanceModel.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false }),
    __metadata("design:type", Number)
], AttendanceModel.prototype, "checkIn", void 0);
AttendanceModel = AttendanceModel_1 = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "attendance_records" })
], AttendanceModel);
exports.default = AttendanceModel;
