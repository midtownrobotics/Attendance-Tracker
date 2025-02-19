import sequelize from './sequelize';
import { ANSIColorCodes, colorLog } from './utils';

async function syncDatabase() {
    try {
        // Sync all defined models to the DB
        await sequelize.sync({ force: false }); // `force: false` prevents dropping the table if it exists
        colorLog("Synced database succesfully", ANSIColorCodes.Green)
    } catch (error) {
        colorLog('Error synchronizing database:' + error, ANSIColorCodes.Red);
    }
}

export default syncDatabase;