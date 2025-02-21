import express, { Response, Request, NextFunction } from 'express';
import path from 'path';
import syncDatabase from './syncDatabase';
import { ANSIColorCodes, colorLog, getFormattedDate } from './utils';
import MemberModel from './MemberModel';
import MeetingModel, { MeetingInformation } from './MeetingModel';
import fs from 'fs';
import AttendanceModel from './AttendanceModel';

const port: number = 8001;

const app = express();

const { ADMIN_USERNAME, ADMIN_PASSWORD } = JSON.parse(fs.readFileSync("./storage/admin.json").toString())

async function adminAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
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
}

app.use(express.static(path.join(__dirname, "/../static")))
app.use(express.json())
app.set('view engine', 'ejs');

app.get('/', async (req: Request, res: Response) => {
    const members: MemberModel[] | null = await MemberModel.getAllMembers();

    if (!members) {
        colorLog("ERROR: Could not access member model.", ANSIColorCodes.Red)
        res.send("Critical error occured. Please contact system admin.")
        return;
    }

    res.render('form',
        {
            memberNames: members.map((m) => m.name),
            leaderboard: members.sort((a, b) => a.attendanceRecord.length - b.attendanceRecord.length),
            rookieLeaderboard: members.filter((m) => m.isRookie).sort((a, b) => a.attendanceRecord.length - b.attendanceRecord.length),
            checkedIn: members.filter((m) => m.attendanceRecord.some((r) => r.date == getFormattedDate()))
        }
    )
});

app.get('/admin', adminAuthenticate, async (req: Request, res: Response) => {
    const members: MemberModel[] | null = await MemberModel.getAllMembers();
    const meetings: MeetingModel[] | null = await MeetingModel.findAll();

    if (!members) {
        colorLog("ERROR: Could not access member model.", ANSIColorCodes.Red)
        res.send("Critical error occured. Unable to access the MEMBER model. Datebase needs to be inspected for corruption, and possibly reset. To reset, change 'force' to true in 'sequelize.sync()' in './node/syncDatabase.ts' and run the server, then change back to false.")
        return;
    }

    if (!meetings) {
        colorLog("ERROR: Could not access meeting model.", ANSIColorCodes.Red)
        res.send("Critical error occured. Unable to access the MEETING model. Datebase needs to be inspected for corruption, and possibly reset. To reset, change 'force' to true in 'sequelize.sync()' in './node/syncDatabase.ts' and run the server, then change back to false.")
        return;
    }

    let meetingInfo: MeetingInformation[] = [];

    for (let i = 0; i < meetings.length; i++) {
        meetingInfo.push({
            meeting: meetings[i],
            count: (await AttendanceModel.getAllByDate(meetings[i].date)).length
        })
    }

    res.render('admin',
        {
            members: members,
            meetings: meetingInfo,
            totalMeetings: (await MeetingModel.findAll())?.length
        }
    )
});

app.post('/', async (req: Request, res: Response) => {
    const action: string | undefined = req.body?.action;
    const name: string | undefined = req.body?.name;

    if (action == "checkIn" && name) {
        (await MemberModel.getMember(req.body.name))?.checkIn()
    }
});

app.post('/admin', adminAuthenticate, async (req: Request, res: Response) => {
    const action: string | undefined = req.body?.action;
    const name: string | undefined = req.body?.name;

    if (action == "add" && name && typeof req.body.isRookie == "boolean") {
        MemberModel.addMember(name, req.body.isRookie)
    }

    if (action == "remove" && name) {
        MemberModel.removeMember(name)
    }

    if (action == "removeMeeting" && req.body.date) {
        MeetingModel.removeMeeting(req.body.date)
        AttendanceModel.removeAllByDate(req.body.date)
    }

    if (action == "clearAllMeetings") {
        MeetingModel.truncate()
        AttendanceModel.truncate()
    }
})

startServer()
async function startServer() {
    await syncDatabase()

    app.listen(port, () => {
        colorLog(`Started server on port: ${port}`, ANSIColorCodes.Green)
    })
};