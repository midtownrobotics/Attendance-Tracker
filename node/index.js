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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const syncDatabase_1 = __importDefault(require("./syncDatabase"));
const utils_1 = require("./utils");
const MemberModel_1 = __importDefault(require("./MemberModel"));
const MeetingModel_1 = __importDefault(require("./MeetingModel"));
const fs_1 = __importDefault(require("fs"));
const AttendanceModel_1 = __importDefault(require("./AttendanceModel"));
const port = 8080;
const app = (0, express_1.default)();
const { ADMIN_USERNAME, ADMIN_PASSWORD } = JSON.parse(fs_1.default.readFileSync("./storage/admin.json").toString());
function adminAuthenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
            res.status(401).send("Authentication required");
            return;
        }
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
        const [username, password] = credentials.split(":");
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            next(); // Proceed to the next middleware
            return;
        }
        res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Area"');
        res.status(401).send("Invalid credentials");
        return;
    });
}
app.use(express_1.default.static(path_1.default.join(__dirname, "/../static")));
app.use(express_1.default.json());
app.set('view engine', 'ejs');
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield MemberModel_1.default.getAllMembers();
    if (!members) {
        (0, utils_1.colorLog)("ERROR: Could not access member model.", utils_1.ANSIColorCodes.Red);
        res.send("Critical error occured. Please contact system admin.");
        return;
    }
    res.render('form', {
        memberNames: members.map((m) => m.name),
        leaderboard: members.sort((a, b) => a.attendanceRecord.length - b.attendanceRecord.length),
        rookieLeaderboard: members.filter((m) => m.isRookie).sort((a, b) => a.attendanceRecord.length - b.attendanceRecord.length),
        checkedIn: members.filter((m) => m.attendanceRecord.some((r) => r.date == (0, utils_1.getFormattedDate)()))
    });
}));
app.get('/admin', adminAuthenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const members = yield MemberModel_1.default.getAllMembers();
    const meetings = yield MeetingModel_1.default.findAll();
    if (!members) {
        (0, utils_1.colorLog)("ERROR: Could not access member model.", utils_1.ANSIColorCodes.Red);
        res.send("Critical error occured. Unable to access the MEMBER model. Datebase needs to be inspected for corruption, and possibly reset. To reset, change 'force' to true in 'sequelize.sync()' in './node/syncDatabase.ts' and run the server, then change back to false.");
        return;
    }
    if (!meetings) {
        (0, utils_1.colorLog)("ERROR: Could not access meeting model.", utils_1.ANSIColorCodes.Red);
        res.send("Critical error occured. Unable to access the MEETING model. Datebase needs to be inspected for corruption, and possibly reset. To reset, change 'force' to true in 'sequelize.sync()' in './node/syncDatabase.ts' and run the server, then change back to false.");
        return;
    }
    res.render('admin', {
        members: members,
        meetings: meetings,
        totalMeetings: (_a = (yield MeetingModel_1.default.findAll())) === null || _a === void 0 ? void 0 : _a.length
    });
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const action = (_a = req.body) === null || _a === void 0 ? void 0 : _a.action;
    const name = (_b = req.body) === null || _b === void 0 ? void 0 : _b.name;
    if (action == "checkIn" && name) {
        (_c = (yield MemberModel_1.default.getMember(req.body.name))) === null || _c === void 0 ? void 0 : _c.checkIn();
    }
}));
app.post('/admin', adminAuthenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const action = (_a = req.body) === null || _a === void 0 ? void 0 : _a.action;
    const name = (_b = req.body) === null || _b === void 0 ? void 0 : _b.name;
    if (action == "add" && name && typeof req.body.isRookie == "boolean") {
        MemberModel_1.default.addMember(name, req.body.isRookie);
    }
    if (action == "remove" && name) {
        MemberModel_1.default.removeMember(name);
    }
    if (action == "removeMeeting" && req.body.date) {
        MeetingModel_1.default.removeMeeting(req.body.date);
        AttendanceModel_1.default.removeAllByDate(req.body.date);
    }
    if (action == "clearAllMeetings") {
        MeetingModel_1.default.truncate();
        AttendanceModel_1.default.truncate();
    }
}));
startServer();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, syncDatabase_1.default)();
        app.listen(port, () => {
            (0, utils_1.colorLog)(`Started server on port: ${port}`, utils_1.ANSIColorCodes.Green);
        });
    });
}
;
