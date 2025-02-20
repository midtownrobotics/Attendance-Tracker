import { Sequelize } from 'sequelize-typescript';
import MemberModel from './MemberModel';
import AttendanceModel from './AttendanceModel';
import MeetingModel from './MeetingModel';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/database.sqlite',
    models: [MeetingModel, MemberModel, AttendanceModel],
    logging: false
});

export default sequelize;