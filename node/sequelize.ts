import { Sequelize } from 'sequelize-typescript';
import MemberModel from './MemberModel';
import AttendanceModel from './AttendanceModel';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/database.sqlite',
    models: [MemberModel, AttendanceModel],
    logging: false
});

export default sequelize;