import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import AttendanceModel from "./AttendanceModel";
import { getFormattedDate } from "./utils";
import { Optional } from "sequelize";
import MeetingModel from "./MeetingModel";

interface Member {
    id: number;
    isRookie: boolean;
    name: string;
}

// Make 'id' optional when creating a member
interface MemberCreationAttributes extends Optional<Member, 'id'> { }

@Table({ tableName: "members" })
class MemberModel extends Model<Member, MemberCreationAttributes> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    public id!: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    public name!: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    public isRookie!: boolean;

    @HasMany(() => AttendanceModel, { as: "attendanceRecord", foreignKey: "memberId" })
    public attendanceRecord!: AttendanceModel[];

    public checkIn() {
        if (this.attendanceRecord.some((r) => r.date == getFormattedDate())) return;
        AttendanceModel.upsert({
            memberId: this.id,
            date: getFormattedDate(),
            checkIn: Date.now()
        })

        MeetingModel.tryAddMeeting(getFormattedDate())
    }

    public static async getMember(name: string): Promise<MemberModel | null>;
    public static async getMember(value: any, identifier: keyof Member): Promise<MemberModel | null>;
    public static async getMember(value: any, identifier: keyof Member = "name"): Promise<MemberModel | null> {
        return MemberModel.findOne({
            where: { [identifier]: value },
            include: [
                { model: AttendanceModel, as: "attendanceRecord" }
            ]
        })
    }

    public static async addMember(name: string, isRookie: boolean): Promise<void> {
        await MemberModel.create({ name, isRookie })
    }

    public static async removeMember(name: string): Promise<void> {
        (await MemberModel.getMember(name))?.destroy()
    }

    public static async getAllMembers(): Promise<MemberModel[] | null> {
        return MemberModel.findAll({
            include: [
                { model: AttendanceModel, as: "attendanceRecord" }
            ]
        })
    }
}

export default MemberModel;