import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import MemberModel from "./MemberModel";
import { Optional } from "sequelize";

interface Attendance {
    id: number;
    memberId: number;
    date: string;
    checkIn: number;
    checkOut: number | null;
}

// Make 'id' optional when creating a member
interface AttendanceCreationAttributes extends Optional<Attendance, 'id'> {}

@Table({ tableName: "attendance_records" })
class AttendanceModel extends Model<Attendance, AttendanceCreationAttributes> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    public id!: number;

    @ForeignKey(() => MemberModel)
    @Column({ type: DataType.INTEGER })
    public memberId!: number;

    @BelongsTo(() => MemberModel)
    public member!: MemberModel;

    @Column({ type: DataType.TEXT, allowNull: false })
    public date!: string;

    @Column({ type: DataType.BIGINT, allowNull: false })
    public checkIn!: number;
}

export default AttendanceModel;