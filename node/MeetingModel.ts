import { Table, Column, Model, DataType } from "sequelize-typescript";

interface Meeting {
    date: string;
}

@Table({ tableName: "meetings" })
class MeetingModel extends Model<Meeting> {
    @Column({ type: DataType.STRING, allowNull: false, primaryKey: true })
    public date!: string;

    public static async tryAddMeeting(date: string) {
        if (!(await MeetingModel.findAll())?.some((m) => m.date == date)) {
            MeetingModel.create({ date })
        }
    }

    public static async removeMeeting(date: string) {
        (await MeetingModel.findOne({where: {date}}))?.destroy()
    }
}

export default MeetingModel;