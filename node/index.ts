import express, { Response, Request } from 'express';
import path from 'path';
import syncDatabase from './syncDatabase';
import { ANSIColorCodes, colorLog, getFormattedDate } from './utils';
import MemberModel from './MemberModel';

const port: number = 8080;

const app = express();

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

app.get('/admin', async (req: Request, res: Response) => {
    const members: MemberModel[] | null = await MemberModel.getAllMembers();

    if (!members) {
        colorLog("ERROR: Could not access member model.", ANSIColorCodes.Red)
        res.send("Critical error occured. Unable to access the member model. Datebase needs to be inspected for corruption, and possibly reset. To reset, change 'force' to true in 'sequelize.sync()' in './node/syncDatabase.ts' and run the server, then change back to false.")
        return;
    }

    res.render('admin', 
        {
            members: members
        }
    )
});

app.post('/', async (req: Request, res: Response) => {
    const action: string | undefined = req.body?.action;
    const name: string | undefined = req.body?.name;

    if (action == "checkIn" && name) {
        (await MemberModel.getMember(req.body.name))?.checkIn()
    }

    if (action == "add" && name && typeof req.body.isRookie == "boolean") {
        MemberModel.addMember(name, req.body.isRookie)
    }

    if (action == "remove" && name) {
        MemberModel.removeMember(name)
    }
});

startServer()
async function startServer() {    
    await syncDatabase()

    app.listen(port, () => {
        colorLog(`Started server on port: ${port}`, ANSIColorCodes.Green)
    })
};