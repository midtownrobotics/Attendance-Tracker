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
var MemberModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const AttendanceModel_1 = __importDefault(require("./AttendanceModel"));
const utils_1 = require("./utils");
const MeetingModel_1 = __importDefault(require("./MeetingModel"));
let MemberModel = MemberModel_1 = class MemberModel extends sequelize_typescript_1.Model {
    checkIn() {
        if (this.attendanceRecord.some((r) => r.date == (0, utils_1.getFormattedDate)()))
            return;
        AttendanceModel_1.default.upsert({
            memberId: this.id,
            date: (0, utils_1.getFormattedDate)(),
            checkIn: Date.now()
        });
        MeetingModel_1.default.tryAddMeeting((0, utils_1.getFormattedDate)());
    }
    static getMember(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, identifier = "name") {
            return MemberModel_1.findOne({
                where: { [identifier]: value },
                include: [
                    { model: AttendanceModel_1.default, as: "attendanceRecord" }
                ]
            });
        });
    }
    static addMember(name, isRookie) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MemberModel_1.create({ name, isRookie });
        });
    }
    static removeMember(name) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = (yield MemberModel_1.getMember(name))) === null || _a === void 0 ? void 0 : _a.destroy();
        });
    }
    static getAllMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            return MemberModel_1.findAll({
                include: [
                    { model: AttendanceModel_1.default, as: "attendanceRecord" }
                ]
            });
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], MemberModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false }),
    __metadata("design:type", String)
], MemberModel.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], MemberModel.prototype, "isRookie", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => AttendanceModel_1.default, { as: "attendanceRecord", foreignKey: "memberId" }),
    __metadata("design:type", Array)
], MemberModel.prototype, "attendanceRecord", void 0);
MemberModel = MemberModel_1 = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "members" })
], MemberModel);
exports.default = MemberModel;
